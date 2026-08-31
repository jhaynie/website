import {
  getAllBulletinsFromDisk,
  parseBulletinMarkdown,
  publishedSorted,
} from './bulletins-disk'
import type { Bulletin, BulletinTopic } from './bulletins-shared'

/**
 * Inline markdown at build time. Vercel serverless does not ship `content/`
 * next to the function, so a runtime `fs` read returns no posts.
 */
const bundledFiles = import.meta.glob<string>(
  '../../content/bulletins/*.{md,mdx}',
  { query: '?raw', import: 'default', eager: true },
)

function filenameFromGlobKey(key: string): string {
  const parts = key.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1] ?? key
}

function getBundledBulletins(): Bulletin[] {
  return publishedSorted(
    Object.entries(bundledFiles).map(([key, raw]) =>
      parseBulletinMarkdown(filenameFromGlobKey(key), raw),
    ),
  )
}

export function getAllBulletins(): Bulletin[] {
  const bundled = getBundledBulletins()
  return bundled.length > 0 ? bundled : getAllBulletinsFromDisk()
}

export function getBulletin(slug: string): Bulletin | undefined {
  return getAllBulletins().find((b) => b.slug === slug)
}

export function getBulletinsByTopic(topic: BulletinTopic | 'all'): Bulletin[] {
  const all = getAllBulletins()
  if (topic === 'all') return all
  return all.filter((b) => (b.topics ?? []).includes(topic))
}
