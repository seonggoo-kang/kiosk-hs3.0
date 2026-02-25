import { readdir } from "fs/promises"
import { join } from "path"
import { NextResponse } from "next/server"

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])

export async function GET() {
  const dir = join(process.cwd(), "public", "banners")
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    const images = entries
      .filter((e) => {
        if (!e.isFile()) return false
        const ext = e.name.slice(e.name.lastIndexOf(".")).toLowerCase()
        return EXTENSIONS.has(ext)
      })
      .map((e) => `/banners/${e.name}`)
      .sort()
    return NextResponse.json(images)
  } catch {
    return NextResponse.json([])
  }
}
