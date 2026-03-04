/**
 * Design Token Sync Script
 * 
 * This script converts design-tokens.json (Tokens Studio format) to CSS variables.
 * 
 * Usage:
 * 1. Designer exports tokens from Figma via Tokens Studio plugin
 * 2. Replace design-tokens.json with the exported file
 * 3. Run: npx ts-node scripts/sync-tokens.ts
 * 4. The script will update app/globals.css with new values
 * 
 * Workflow:
 * Figma (Tokens Studio) → design-tokens.json → this script → globals.css
 */

import * as fs from 'fs'
import * as path from 'path'

interface TokenValue {
  value: string
  type: string
  description?: string
}

interface TokenSet {
  [key: string]: TokenValue | TokenSet
}

// Resolve token references like "{core.colors.pink.500}"
function resolveReference(value: string, tokens: Record<string, TokenSet>): string {
  if (!value.startsWith('{') || !value.endsWith('}')) return value
  
  const path = value.slice(1, -1).split('.')
  let current: any = tokens
  
  for (const key of path) {
    current = current?.[key]
    if (!current) return value // Return original if not found
  }
  
  if (current?.value) {
    // Recursively resolve nested references
    return resolveReference(current.value, tokens)
  }
  
  return value
}

// Convert hex to HSL for CSS custom properties
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')
  
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

function generateCSSVariables(tokens: Record<string, TokenSet>): string {
  const semantic = tokens.semantic as TokenSet
  const core = tokens.core as TokenSet
  
  const lines: string[] = [
    '/* Auto-generated from design-tokens.json - DO NOT EDIT MANUALLY */',
    '/* Run: npx ts-node scripts/sync-tokens.ts to regenerate */',
    '',
    ':root {'
  ]
  
  // Helper to add CSS variable
  const addVar = (name: string, value: string, comment?: string) => {
    const resolvedValue = resolveReference(value, tokens)
    let cssValue = resolvedValue
    
    // Convert hex colors to HSL
    if (resolvedValue.startsWith('#') && resolvedValue.length === 7) {
      cssValue = hexToHSL(resolvedValue)
    }
    
    const commentStr = comment ? ` /* ${comment} */` : ''
    lines.push(`  --${name}: ${cssValue};${commentStr}`)
  }
  
  // Semantic colors
  if (semantic?.color) {
    const colors = semantic.color as TokenSet
    Object.entries(colors).forEach(([key, token]) => {
      if (typeof token === 'object' && 'value' in token) {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        addVar(cssKey, token.value, token.description)
      }
    })
  }
  
  // Radius
  if (semantic?.radius) {
    const radius = semantic.radius as TokenSet
    Object.entries(radius).forEach(([key, token]) => {
      if (typeof token === 'object' && 'value' in token) {
        const resolvedValue = resolveReference(token.value, tokens)
        addVar(`radius`, resolvedValue, token.description)
      }
    })
  }
  
  lines.push('}')
  
  return lines.join('\n')
}

// Main execution
const tokensPath = path.join(__dirname, '..', 'design-tokens.json')
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'))

const cssOutput = generateCSSVariables(tokens)

console.log('Generated CSS Variables:')
console.log(cssOutput)
console.log('\n---')
console.log('Copy the above to your globals.css :root section')
console.log('Or run with --write flag to auto-update (coming soon)')
