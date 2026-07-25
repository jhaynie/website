import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  normalizeTopics,
  type Bulletin,
  type BulletinTopic,
} from './bulletins-shared'

function resolveContentDir(): string {
  const candidates = [
    path.join(process.cwd(), 'content', 'bulletins'),
    // Nitro/Agentuity deploy layout: content copied next to .output
    path.join(process.cwd(), '.output', 'content', 'bulletins'),
    // Fallback relative to this module when bundled
    path.join(path.dirname(new URL(import.meta.url).pathname), 'content', 'bulletins'),
  ]
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir
  }
  return candidates[0]
}

const CONTENT_DIR = resolveContentDir()

function toIsoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  const s = String(value ?? '')
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return s
}

function parseFile(filename: string): Bulletin {
  const full = path.join(CONTENT_DIR, filename)
  const raw = fs.readFileSync(full, 'utf8')
  const { data, content } = matter(raw)
  const slug = filename.replace(/\.mdx?$/, '')
  const d = data as Record<string, unknown>

  return {
    slug,
    title: String(data.title ?? slug),
    date: toIsoDate(data.date),
    id: String(data.id ?? slug),
    topics: normalizeTopics(
      d.topics as string[] | string | undefined,
      d.topic,
    ),
    excerpt: String(data.excerpt ?? ''),
    hero: String(data.hero ?? '/bulletins/heroes/default.svg'),
    thumb: data.thumb ? String(data.thumb) : undefined,
    canonical: data.canonical ? String(data.canonical) : undefined,
    source: data.source ? String(data.source) : undefined,
    draft: Boolean(data.draft),
    body: content.trim(),
  }
}

export function getAllBulletins(): Bulletin[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(parseFile)
    .filter((b) => !b.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getBulletin(slug: string): Bulletin | undefined {
  return getAllBulletins().find((b) => b.slug === slug)
}

export function getBulletinsByTopic(topic: BulletinTopic | 'all'): Bulletin[] {
  const all = getAllBulletins()
  if (topic === 'all') return all
  return all.filter((b) => (b.topics ?? []).includes(topic))
}
