/**
 * Writes public/sitemap.xml from routes + bulletins.
 * Run: bun run generate-sitemap
 * Set VITE_SITE_URL for absolute URLs (required for a useful sitemap).
 */
import fs from 'node:fs'
import path from 'node:path'
import { getAllBulletinsFromDisk as getAllBulletins } from '../src/lib/bulletins-disk'

const siteUrl = (process.env.VITE_SITE_URL ?? 'https://jhaynie.dev').replace(
  /\/$/,
  '',
)
const out = path.join(process.cwd(), 'public', 'sitemap.xml')

const staticPaths = ['/', '/bulletins']
const posts = getAllBulletins()

const urls = [
  ...staticPaths.map((p) => ({
    loc: `${siteUrl}${p === '/' ? '' : p}`,
    lastmod: new Date().toISOString().slice(0, 10),
    changefreq: p === '/' ? 'weekly' : 'weekly',
    priority: p === '/' ? '1.0' : '0.8',
  })),
  ...posts.map((b) => ({
    loc: `${siteUrl}/bulletins/${b.slug}`,
    lastmod: b.date,
    changefreq: 'monthly',
    priority: '0.7',
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

fs.writeFileSync(out, xml, 'utf8')
console.log(`wrote ${path.relative(process.cwd(), out)} (${urls.length} URLs)`)
console.log(`base: ${siteUrl}`)
