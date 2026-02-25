import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const base = '/vercel/share/v0-project/public/products'

function walk(dir, prefix = '') {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = join(dir, e.name)
    const rel = prefix ? `${prefix}/${e.name}` : e.name
    if (e.isDirectory()) {
      console.log(`[DIR] ${rel}`)
      walk(full, rel)
    } else {
      const stat = statSync(full)
      console.log(`  ${rel}  (${stat.size} bytes, ${stat.mtime.toISOString()})`)
    }
  }
}

walk(base)
