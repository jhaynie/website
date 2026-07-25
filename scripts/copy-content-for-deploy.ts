/**
 * Copies markdown content into .output so Agentuity runtime can read posts
 * when only the Nitro bundle + package root are present.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const src = path.join(root, 'content')
const dest = path.join(root, '.output', 'content')

if (!fs.existsSync(src)) {
  console.warn('No content/ directory to copy')
  process.exit(0)
}

if (!fs.existsSync(path.join(root, '.output'))) {
  console.error('Missing .output — run vite build first')
  process.exit(1)
}

fs.cpSync(src, dest, { recursive: true })
console.log(`copied content/ → ${path.relative(root, dest)}`)
