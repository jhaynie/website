/**
 * Builds public/og.png from homepage hero copy.
 * Run: bun run scripts/generate-og.tsx
 */
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const WIDTH = 1200
const HEIGHT = 630

const title = 'I write about software and being a full-time builder.'
const subtitle =
  'Founder, builder and 80s computer kid. I write about building software, the future of AI and Agentic Business, and the long arc from a blinking cursor to production systems.'

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Rough wrap for SVG tspans at ~ maxChars */
function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length > maxChars && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = next
    }
  }
  if (cur) lines.push(cur)
  return lines
}

const titleLines = wrapLines(title, 28)
const subLines = wrapLines(subtitle, 52)

const titleTspans = titleLines
  .map((line, i) => {
    const dy = i === 0 ? 0 : 58
    return `<tspan x="96" dy="${dy}">${escapeXml(line)}</tspan>`
  })
  .join('')

const subTspans = subLines
  .map((line, i) => {
    const dy = i === 0 ? 0 : 32
    return `<tspan x="96" dy="${dy}">${escapeXml(line)}</tspan>`
  })
  .join('')

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1c171c"/>
      <stop offset="55%" stop-color="#141214"/>
      <stop offset="100%" stop-color="#101418"/>
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="20%" cy="30%" r="55%">
      <stop offset="0%" stop-color="rgba(180,70,140,0.22)"/>
      <stop offset="100%" stop-color="rgba(180,70,140,0)"/>
    </radialGradient>
    <radialGradient id="glow2" cx="85%" cy="70%" r="45%">
      <stop offset="0%" stop-color="rgba(80,200,180,0.12)"/>
      <stop offset="100%" stop-color="rgba(80,200,180,0)"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow2)"/>

  <!-- identity -->
  <text x="96" y="88" fill="#f0ebe6" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="28" font-weight="700" letter-spacing="-0.4">Jeff Haynie</text>
  <text x="96" y="118" fill="#a89f96" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18" letter-spacing="0.5">@jhaynie</text>

  <!-- load line -->
  <text x="96" y="190" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="16" letter-spacing="1">
    <tspan fill="#7a746e">LOAD"*",8,1</tspan>
    <tspan fill="#6ec9c0" dx="14">RUN</tspan>
  </text>

  <!-- hero title + phosphor cursor -->
  <text x="96" y="250" fill="#f0ebe6" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="48" font-weight="700" letter-spacing="-1.2">${titleTspans}</text>
  <rect x="96" y="${250 + (titleLines.length - 1) * 58 + 12}" width="18" height="42" fill="#7dffb0" opacity="0.95"/>

  <!-- subtext -->
  <text x="96" y="${250 + titleLines.length * 58 + 48}" fill="#a89f96" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="400">${subTspans}</text>

  <!-- footer rail -->
  <rect x="0" y="576" width="${WIDTH}" height="54" fill="rgba(0,0,0,0.35)"/>
  <text x="96" y="610" fill="#7a746e" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14" letter-spacing="1.5">BULLETINS · CATALOG · SYSOP</text>
  <text x="1104" y="610" text-anchor="end" fill="#7a746e" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14" letter-spacing="1">SYS INIT 1971</text>
</svg>
`

const outDir = path.join(process.cwd(), 'public')
const svgPath = path.join(outDir, 'og.svg')
const pngPath = path.join(outDir, 'og.png')

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(svgPath, svg, 'utf8')

await sharp(Buffer.from(svg))
  .resize(WIDTH, HEIGHT)
  .png({ quality: 90 })
  .toFile(pngPath)

console.log(`wrote ${path.relative(process.cwd(), svgPath)}`)
console.log(`wrote ${path.relative(process.cwd(), pngPath)}`)
