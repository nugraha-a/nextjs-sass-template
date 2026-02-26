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

async function ensureDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true })
    }
}

async function deleteFileIfExists(filePath: string) {
    try {
        const fullPath = path.join(process.cwd(), "public", filePath)
        if (existsSync(fullPath)) {
            await unlink(fullPath)
        }
    } catch {
        // Silently ignore deletion errors
    }
}

export async function POST(request: NextRequest) {
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

        // Delete old image if header provided
        const oldImage = request.headers.get("x-old-image")
        if (oldImage && oldImage.startsWith("/uploads/sidebar/")) {
            await deleteFileIfExists(oldImage)
        }

        await ensureDir()

        const ext = EXT_MAP[file.type] || "jpg"
        const filename = `sidebar-bg-${Date.now()}.${ext}`
        const filePath = path.join(UPLOAD_DIR, filename)

        const bytes = await file.arrayBuffer()
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
    try {
        const { url } = await request.json()

        if (!url || !url.startsWith("/uploads/sidebar/")) {
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
