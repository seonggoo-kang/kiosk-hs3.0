import { readdir } from "fs/promises"
import { join } from "path"
import { NextResponse } from "next/server"

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])
const VIDEO_EXTS = new Set([".mp4", ".webm"])

export type BannerItem = { src: string; type: "image" | "video" }

export async function GET() {
  const dir = join(process.cwd(), "public", "banners")
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    const items: BannerItem[] = entries
      .filter((e) => {
        if (!e.isFile()) return false
        const ext = e.name.slice(e.name.lastIndexOf(".")).toLowerCase()
        return IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext)
      })
      .map((e) => {
        const ext = e.name.slice(e.name.lastIndexOf(".")).toLowerCase()
        return {
          src: `/banners/${e.name}`,
          type: VIDEO_EXTS.has(ext) ? "video" as const : "image" as const,
        }
      })
      .sort((a, b) => a.src.localeCompare(b.src))
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}
