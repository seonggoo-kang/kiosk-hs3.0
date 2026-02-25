const { readdirSync, statSync } = require('fs')
const { join } = require('path')

const base = '/vercel/share/v0-project/public/products'

function walk(dir, prefix) {
  prefix = prefix || ''
  const entries = readdirSync(dir, { withFileTypes: true })
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    const full = join(dir, e.name)
    const rel = prefix ? prefix + '/' + e.name : e.name
    if (e.isDirectory()) {
      console.log('[DIR] ' + rel)
      walk(full, rel)
    } else {
      const stat = statSync(full)
      console.log('  ' + rel + '  (' + stat.size + ' bytes, ' + stat.mtime.toISOString() + ')')
    }
  }
}

walk(base)
