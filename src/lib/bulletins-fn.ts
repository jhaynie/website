import { createServerFn } from '@tanstack/react-start'
import { normalizeTopics, type Bulletin } from './bulletins-shared'

function ensureTopics(b: Bulletin): Bulletin {
  return {
    ...b,
    topics: normalizeTopics(b.topics, (b as { topic?: unknown }).topic),
  }
}

export const loadBulletins = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Bulletin[]> => {
    const { getAllBulletins } = await import('./bulletins.server')
    return getAllBulletins().map(ensureTopics)
  },
)

export const loadBulletin = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<Bulletin | null> => {
    const { getBulletin } = await import('./bulletins.server')
    const bulletin = getBulletin(slug)
    return bulletin ? ensureTopics(bulletin) : null
  })
