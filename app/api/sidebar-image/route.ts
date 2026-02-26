import { NextRequest, NextResponse } from "next/server"
import { writeFile, unlink, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "sidebar")
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

function isAuthenticated(request: NextRequest): boolean {
    const accessToken = request.cookies.get("at")?.value
    return Boolean(accessToken)
}

function isPathSafe(filePath: string): boolean {
    const resolved = path.resolve(process.cwd(), "public", filePath)
    const safeBase = path.resolve(UPLOAD_DIR)
    return resolved.startsWith(safeBase + path.sep) || resolved === safeBase
}

async function ensureDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true })
    }
}

async function deleteFileIfExists(filePath: string) {
    try {
        const resolved = path.resolve(process.cwd(), "public", filePath)
        // Double-check path safety before deletion
        if (!resolved.startsWith(path.resolve(UPLOAD_DIR))) {
            return
        }
        if (existsSync(resolved)) {
            await unlink(resolved)
        }
    } catch {
        // Silently ignore deletion errors
    }
}

export async function POST(request: NextRequest) {
    // ─── Auth check ───
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

        // ─── Verify actual file content via magic bytes ───
        const bytes = await file.arrayBuffer()
        if (!verifyMagicBytes(bytes, file.type)) {
            return NextResponse.json(
                { error: "File content does not match declared type." },
                { status: 400 }
            )
        }

        // Delete old image if header provided (with path safety check)
        const oldImage = request.headers.get("x-old-image")
        if (oldImage && oldImage.startsWith("/uploads/sidebar/") && isPathSafe(oldImage)) {
            await deleteFileIfExists(oldImage)
        }

        await ensureDir()

        const ext = EXT_MAP[file.type] || "jpg"
        const rawFilename = `sidebar-bg-${Date.now()}.${ext}`
        const filename = sanitizeFilename(rawFilename)
        const filePath = path.join(UPLOAD_DIR, filename)

        // Final path safety check
        if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
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

export async function DELETE(request: NextRequest) {
    // ─── Auth check ───
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { url } = await request.json()

        if (!url || typeof url !== "string" || !url.startsWith("/uploads/sidebar/")) {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 })
        }

        // Path traversal protection
        if (!isPathSafe(url)) {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 })
        }

        await deleteFileIfExists(url)

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json(
            { error: "Delete failed" },
            { status: 500 }
        )
    }
}
