import { createFileRoute } from '@tanstack/react-router'
import { SiteNav } from '#/components/SiteNav'
import { SiteFooter } from '#/components/SiteFooter'
import { BulletinList } from '#/components/BulletinList'
import type { BulletinTopic } from '#/lib/bulletins-shared'
import { loadBulletins } from '#/lib/bulletins-fn'
import { buildSeoHead } from '#/lib/site'

type BulletinsSearch = {
  topic?: 'all' | BulletinTopic
}

export const Route = createFileRoute('/bulletins/')({
  validateSearch: (search: Record<string, unknown>): BulletinsSearch => {
    const t = search.topic
    if (t === 'agents' || t === 'coding' || t === 'business' || t === 'all') {
      return { topic: t }
    }
    return {}
  },
  loader: async () => ({ bulletins: await loadBulletins() }),
  component: BulletinsIndexPage,
  head: () => {
    const seo = buildSeoHead({
      title: 'Bulletins',
      description:
        'Writing on software, engineering, startups, and shipping product — from Medium archives and new notes.',
      path: '/bulletins',
    })
    return { meta: seo.meta, links: seo.links }
  },
})

function BulletinsIndexPage() {
  const { bulletins } = Route.useLoaderData()
  const { topic } = Route.useSearch()

  return (
    <div className="wrap">
      <SiteNav current="bulletins" />
      <main id="main">
        <header className="page-head">
          <p className="line-no">100</p>
          <h1>Bulletins</h1>
          <p>
            Writing on software, AI, and the long arc from a blinking cursor to production
            systems.
          </p>
          <p className="count">{bulletins.length} POSTS · LATEST FIRST</p>
        </header>
        <BulletinList
          bulletins={bulletins}
          initialTopic={topic && topic !== 'all' ? topic : 'all'}
          filterVariant="quiet"
        />
      </main>
      <SiteFooter />
    </div>
  )
}
