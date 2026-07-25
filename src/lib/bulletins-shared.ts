export type BulletinTopic = 'agents' | 'coding' | 'business'

export const BULLETIN_TOPICS: BulletinTopic[] = ['agents', 'coding', 'business']

export type BulletinMeta = {
  slug: string
  title: string
  date: string
  id: string
  /** One or more categories for filtering */
  topics: BulletinTopic[]
  excerpt: string
  hero: string
  /** Optional list-thumbnail motif (e.g. us-flag) */
  thumb?: string
  /** Original Medium (or other) URL when imported */
  canonical?: string
  source?: string
  draft?: boolean
}

export type Bulletin = BulletinMeta & {
  body: string
}

export function formatBulletinDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d
    .toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    .toUpperCase()
}

/** Normalize topics from new (`topics`) or legacy (`topic`) shapes / stale cache. */
export function normalizeTopics(
  input?: BulletinTopic[] | BulletinTopic | string[] | string | null,
  legacyTopic?: unknown,
): BulletinTopic[] {
  const raw = input ?? legacyTopic
  const list: string[] = Array.isArray(raw)
    ? raw.map(String)
    : raw
      ? [String(raw)]
      : []
  const topics = list.map((t) => t.trim().toLowerCase()).filter(isBulletinTopic)
  return topics.length ? topics : ['coding']
}

export function formatTopics(
  topics?: BulletinTopic[] | BulletinTopic | string[] | string | null,
): string {
  return normalizeTopics(topics).join(' · ')
}

export function bulletinMatchesTopic(
  bulletin: Pick<BulletinMeta, 'topics'> & { topic?: unknown },
  topic: BulletinTopic | 'all',
): boolean {
  if (topic === 'all') return true
  return normalizeTopics(bulletin.topics, bulletin.topic).includes(topic)
}

export function isBulletinTopic(value: string): value is BulletinTopic {
  return (BULLETIN_TOPICS as string[]).includes(value)
}

export function primaryTopic(
  bulletin: Pick<BulletinMeta, 'topics'> & { topic?: unknown },
): BulletinTopic {
  return normalizeTopics(bulletin.topics, bulletin.topic)[0] ?? 'coding'
}
