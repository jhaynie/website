/**
 * Pull posts from https://medium.com/@jhaynie (RSS) into content/bulletins.
 * Run: bun run import-medium
 *
 * Medium's public feed exposes the latest ~10 posts with full HTML content.
 */
import fs from 'node:fs'
import path from 'node:path'
import TurndownService from 'turndown'

const FEED = 'https://medium.com/feed/@jhaynie'
const OUT = path.join(process.cwd(), 'content', 'bulletins')

type Topic = 'agents' | 'coding' | 'business'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2010-\u2015—–]/g, '-')
    .replace(/[''"]/g, '')
    .replace(/@/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function decodeCdata(s: string): string {
  return s
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function firstMatch(xml: string, re: RegExp): string {
  const m = xml.match(re)
  return m ? decodeCdata(m[1].trim()) : ''
}

function allMatches(xml: string, re: RegExp): string[] {
  const out: string[] = []
  let m: RegExpExecArray | null
  const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`)
  while ((m = r.exec(xml))) out.push(decodeCdata(m[1].trim()))
  return out
}

function extractItems(rss: string): string[] {
  const items: string[] = []
  const re = /<item>([\s\S]*?)<\/item>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(rss))) items.push(m[1])
  return items
}

function firstImage(html: string): string | undefined {
  // Prefer CDN URLs (Medium sometimes breaks alt= quotes around src)
  const cdn = html.match(
    /https:\/\/cdn-images-1\.medium\.com\/max\/\d+\/[A-Za-z0-9_*+-]+\.(?:jpeg|jpg|png|gif|webp)/i,
  )
  if (cdn) return cdn[0].replace(/\/max\/\d+\//, '/max/1600/')

  const re = /src=["'](https?:\/\/[^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const src = m[1]
    if (src.includes('medium.com/_/stat')) continue
    if (!/\.(jpe?g|png|gif|webp)(\?|$)/i.test(src) && !src.includes('cdn-images'))
      continue
    return src.replace(/\/max\/\d+\//, '/max/1600/')
  }
  return undefined
}

function stripJunkHtml(html: string): string {
  return html
    .replace(/<img[^>]+medium\.com\/_\/stat[^>]*>/gi, '')
    .replace(/<figcaption[\s\S]*?<\/figcaption>/gi, '')
    .replace(/<\/?figure[^>]*>/gi, '')
    .replace(/<hr\s*\/?>[\s\S]*was originally published[\s\S]*$/i, '')
    .replace(/<a href="https:\/\/medium\.com\/media\/[^"]+">[\s\S]*?<\/a>/gi, '')
    .replace(/ /g, ' ')
    .replace(/\u00a0/g, ' ')
}

function mapTopic(categories: string[], title: string): Topic {
  const blob = [...categories, title].join(' ').toLowerCase()
  if (/\b(agent|agentic|llm)\b/.test(blob)) return 'agents'
  if (
    /\b(engops|software|engineering|developer|devops|code|programming|innovation)\b/.test(
      blob,
    )
  ) {
    // Startup / founder posts stay in business even if they mention engineering
    if (/\b(startup|vc|venture|founder|entrepreneur|ecosystem|ceo|commandments)\b/.test(blob)) {
      if (/\bengops\b/.test(blob) && !/\bstartup\b/.test(blob)) return 'coding'
      if (/\bengops\b/.test(blob)) return 'coding'
    }
    if (/\bengops\b/.test(blob) || /\bsoftware-development\b/.test(blob)) return 'coding'
  }
  if (/\bengops\b/.test(blob) || /\bsoftware-development\b/.test(blob) || /\bengineering\b/.test(blob))
    return 'coding'
  return 'business'
}

function excerptFromMarkdown(md: string, max = 180): string {
  const plain = md
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/[*_>`#]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= max) return plain
  const cut = plain.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return `${(sp > 80 ? cut.slice(0, sp) : cut).trim()}…`
}

function yamlEscape(s: string): string {
  return JSON.stringify(s)
}

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
})

// Drop empty / junk links and clean images
turndown.addRule('cleanImages', {
  filter: 'img',
  replacement: (_content, node) => {
    const el = node as unknown as { getAttribute: (n: string) => string | null }
    const src = el.getAttribute('src') || ''
    if (!src || src.includes('/_/stat')) return ''
    const alt = (el.getAttribute('alt') || '').replace(/<[^>]+>/g, '').trim()
    const cleanSrc = src.replace(/\/max\/\d+\//, '/max/1600/')
    return alt ? `\n\n![${alt}](${cleanSrc})\n\n` : `\n\n![](${cleanSrc})\n\n`
  },
})

console.log(`Fetching ${FEED} …`)
const res = await fetch(FEED, {
  headers: { 'User-Agent': 'jhaynie-site-import/1.0' },
})
if (!res.ok) throw new Error(`Feed failed: ${res.status}`)
const rss = await res.text()
const items = extractItems(rss)
if (!items.length) throw new Error('No items in Medium feed')

fs.mkdirSync(OUT, { recursive: true })
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith('.md') || f.endsWith('.mdx')) fs.unlinkSync(path.join(OUT, f))
}

const ordered = items.map((itemXml, index) => {
  const title = firstMatch(itemXml, /<title>([\s\S]*?)<\/title>/)
    .replace(/\u2014/g, '—')
    .replace(/\s+/g, ' ')
    .trim()
  const link = firstMatch(itemXml, /<link>([\s\S]*?)<\/link>/).split('?')[0]
  const pubDate = firstMatch(itemXml, /<pubDate>([\s\S]*?)<\/pubDate>/)
  const categories = allMatches(itemXml, /<category>([\s\S]*?)<\/category>/)
  let content =
    firstMatch(itemXml, /<content:encoded>([\s\S]*?)<\/content:encoded>/) ||
    firstMatch(itemXml, /<description>([\s\S]*?)<\/description>/)
  content = stripJunkHtml(content)
  const hero = firstImage(content) ?? '/bulletins/heroes/default.svg'
  let body = turndown.turndown(content).trim()
  // Drop leading H1–H3 that only restates the title
  body = body.replace(/^#{1,3}\s+.+\n+/, '').trim()
  // Drop leading image if it matches the hero (detail page already shows hero)
  body = body.replace(/^!\[[^\]]*\]\([^)]+\)\s*/m, '').trim()
  // Soften Medium weird spacing
  body = body.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n')

  const date = new Date(pubDate)
  const iso = Number.isNaN(date.getTime())
    ? pubDate.slice(0, 10)
    : date.toISOString().slice(0, 10)
  const slug = slugify(title) || `post-${index + 1}`
  const topic = mapTopic(categories, title)
  const id = `BBS-${String(items.length - index).padStart(2, '0')}`
  return { title, link, iso, categories, hero, body, slug, topic, id }
})

// Manual topic overrides for known posts
const topicOverrides: Record<string, Topic> = {
  'the-five-commandments-of-a-startup': 'business',
  'a-founder-s-guide-to-evaluating-the-right-vc-partner': 'business',
  'how-to-do-innovation': 'business',
  'the-one-book-every-startup-ceo-should-read': 'business',
  'engops-a-better-way-to-build-software': 'coding',
  'the-next-thing-we-call-it-engops': 'coding',
}

for (const post of ordered) {
  const topic = topicOverrides[post.slug] ?? post.topic
  const excerpt = excerptFromMarkdown(post.body)
  const front = [
    '---',
    `title: ${yamlEscape(post.title)}`,
    `date: ${post.iso}`,
    `id: ${post.id}`,
    `topics:`,
    `  - ${topic}`,
    `excerpt: ${yamlEscape(excerpt)}`,
    `hero: ${yamlEscape(post.hero)}`,
    `source: medium`,
    `canonical: ${yamlEscape(post.link)}`,
    '---',
    '',
    post.body,
    '',
  ].join('\n')

  const file = path.join(OUT, `${post.slug}.md`)
  fs.writeFileSync(file, front, 'utf8')
  console.log(`wrote ${path.relative(process.cwd(), file)} [${topic}] ${post.iso}`)
}

console.log(`\nImported ${ordered.length} posts from Medium @jhaynie`)
