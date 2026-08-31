/**
 * Copies markdown into Nitro's node-server output so Agentuity can read posts
 * from disk. On Vercel, Nitro writes `.vercel/output` instead of `.output`,
 * and posts are already inlined via import.meta.glob — skip the copy.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const src = path.join(root, 'content')
const outputDir = path.join(root, '.output')
const vercelOutputDir = path.join(root, '.vercel', 'output')

if (!fs.existsSync(src)) {
  console.warn('No content/ directory to copy')
  process.exit(0)
}

if (!fs.existsSync(outputDir)) {
  if (process.env.VERCEL || fs.existsSync(vercelOutputDir)) {
    console.log(
      'skipping content copy (Vercel/Nitro output; posts are bundled at build)',
    )
    process.exit(0)
  }
  console.error('Missing .output — run vite build first')
  process.exit(1)
}

const dest = path.join(outputDir, 'content')
fs.cpSync(src, dest, { recursive: true })
console.log(`copied content/ → ${path.relative(root, dest)}`)
