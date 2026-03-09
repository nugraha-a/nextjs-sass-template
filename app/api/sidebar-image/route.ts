import { NextRequest, NextResponse } from "next/server"
import { writeFile, unlink, mkdir, readdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { isDemoToken } from "@/lib/api/demo-data"
import { verifySignedValue } from "@/lib/api/cookies"

const PUBLIC_DIR = path.resolve(process.cwd(), "public")
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads", "sidebar")
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const EXT_MAP: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}

// ─── Magic bytes for file type verification ───
const MAGIC_BYTES: Record<string, number[][]> = {
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header
}

function verifyMagicBytes(buffer: ArrayBuffer, mimeType: string): boolean {
    const signatures = MAGIC_BYTES[mimeType]
    if (!signatures) return false

    const bytes = new Uint8Array(buffer)
    return signatures.some((sig) =>
        sig.every((byte, i) => bytes[i] === byte)
    )
}

function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, "")
}

/**
 * SECURITY: Validate token value, not just existence.
 * Checks for valid demo token or non-empty real token.
 * For production, this should verify JWT signature against backend.
 */
function isAuthenticated(request: NextRequest): boolean {
    const rawToken = request.cookies.get("at")?.value
    if (!rawToken) return false

    const accessToken = verifySignedValue(rawToken)
    if (!accessToken) return false

    // Demo session: validate against known demo token prefix
    const rawDemo = request.cookies.get("dm")?.value
    const isDemoSession = rawDemo ? verifySignedValue(rawDemo) === "true" : false
    if (isDemoSession) {
        return isDemoToken(accessToken)
    }

    // Real session: token must be non-trivial (min JWT-like length)
    return accessToken.length >= 20
}

/**
 * Convert a public URL path like "/uploads/sidebar/img.jpg"
 * to an absolute filesystem path, safely.
 *
 * SECURITY: Extracts only the basename from the input, validates it
 * against a strict allowlist pattern, and constructs the path from
 * scratch under UPLOAD_DIR. This eliminates any user-controlled
 * directory components, making path traversal impossible.
 */
function resolveUploadPath(urlPath: string): string | null {
    // Extract only the filename — ignores any directory traversal in user input
    const basename = path.basename(urlPath)

    // Reject empty, dotfiles, or filenames with unsafe characters
    if (!basename || basename.startsWith(".") || /[^a-zA-Z0-9._-]/.test(basename)) {
        return null
    }

    // Construct path from validated basename only (never from raw user input)
    const resolved = path.join(UPLOAD_DIR, basename)

    // Belt-and-suspenders: verify the resolved path is still inside UPLOAD_DIR
    if (!resolved.startsWith(UPLOAD_DIR + path.sep) && resolved !== UPLOAD_DIR) {
        return null
    }

    return resolved
}

async function ensureDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true })
    }
}

/**
 * Safely delete a file by its public URL path.
 * Returns true if file was actually deleted.
 */
async function safeDeleteFile(urlPath: string): Promise<boolean> {
    const resolved = resolveUploadPath(urlPath)
    if (!resolved) return false

    try {
        if (existsSync(resolved)) {
            await unlink(resolved)
            return true
        }
    } catch {
        // Deletion error — file may be locked or already gone
    }
    return false
}

// ─── POST: Upload new sidebar image ───
export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get("image") as File | null

        if (!file) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 })
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid format. Only JPG, PNG, WebP are allowed." },
                { status: 400 }
            )
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 2MB." },
                { status: 400 }
            )
        }

        // Verify actual file content via magic bytes
        const bytes = await file.arrayBuffer()
        if (!verifyMagicBytes(bytes, file.type)) {
            return NextResponse.json(
                { error: "File content does not match declared type." },
                { status: 400 }
            )
        }

        // Delete old image if header provided
        const oldImage = request.headers.get("x-old-image")
        if (oldImage && oldImage.startsWith("/uploads/sidebar/")) {
            await safeDeleteFile(oldImage)
        }

        await ensureDir()

        const ext = EXT_MAP[file.type] || "jpg"
        const rawFilename = `sidebar-bg-${Date.now()}.${ext}`
        const filename = sanitizeFilename(rawFilename)
        const filePath = path.join(UPLOAD_DIR, filename)

        // Final safety check
        if (!filePath.startsWith(UPLOAD_DIR)) {
            return NextResponse.json({ error: "Invalid file path" }, { status: 400 })
        }

        await writeFile(filePath, Buffer.from(bytes))

        return NextResponse.json({ url: `/uploads/sidebar/${filename}` })
    } catch {
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        )
    }
}

// ─── DELETE: Remove a sidebar image ───
export async function DELETE(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { url } = await request.json()

        if (!url || typeof url !== "string") {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 })
        }

        if (!url.startsWith("/uploads/sidebar/")) {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 })
        }

        // Prevent deleting directories or dotfiles
        const basename = path.basename(url)
        if (!basename || basename.startsWith(".") || basename.includes("..")) {
            return NextResponse.json({ error: "Invalid filename" }, { status: 400 })
        }

        const deleted = await safeDeleteFile(url)

        return NextResponse.json({ success: true, deleted })
    } catch {
        return NextResponse.json(
            { error: "Delete failed" },
            { status: 500 }
        )
    }
}

// ─── Cleanup: Remove orphaned files older than 24h ───
// Called internally or via cron. Not exposed as public route.
export async function cleanupOrphanedFiles() {
    try {
        if (!existsSync(UPLOAD_DIR)) return

        const files = await readdir(UPLOAD_DIR)
        const now = Date.now()
        const MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours

        for (const file of files) {
            // Extract timestamp from filename: sidebar-bg-{timestamp}.ext
            const match = file.match(/sidebar-bg-(\d+)\./)
            if (!match) continue

            const fileTimestamp = parseInt(match[1], 10)
            if (now - fileTimestamp > MAX_AGE) {
                const filePath = path.join(UPLOAD_DIR, file)
                try {
                    await unlink(filePath)
                } catch {
                    // Skip files that can't be deleted
                }
            }
        }
    } catch {
        // Cleanup is best-effort
    }
}
