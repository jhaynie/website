import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SiteNav } from '#/components/SiteNav'
import { SiteFooter } from '#/components/SiteFooter'
import { JsonLd } from '#/components/JsonLd'
import { formatBulletinDate, formatTopics } from '#/lib/bulletins-shared'
import { loadBulletin } from '#/lib/bulletins-fn'
import { blogPostingJsonLd, buildSeoHead } from '#/lib/site'

export const Route = createFileRoute('/bulletins/$slug')({
  loader: async ({ params }) => {
    const bulletin = await loadBulletin({ data: params.slug })
    if (!bulletin) throw notFound()
    return { bulletin }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.bulletin) {
      const seo = buildSeoHead({ title: 'Bulletin', path: '/bulletins' })
      return { meta: seo.meta, links: seo.links }
    }
    const b = loaderData.bulletin
    const path = `/bulletins/${b.slug}`
    const image =
      b.hero.startsWith('http') || b.hero.startsWith('/')
        ? b.hero.startsWith('http')
          ? undefined
          : b.hero
        : '/og.png'
    // Prefer site OG for external Medium CDN images (some crawlers are picky)
    const seo = buildSeoHead({
      title: b.title,
      description: b.excerpt,
      path,
      image: image && !image.startsWith('http') ? image : '/og.png',
      type: 'article',
      publishedTime: b.date,
      tags: b.topics ?? [],
    })
    return { meta: seo.meta, links: seo.links }
  },
  component: BulletinDetailPage,
  notFoundComponent: () => (
    <div className="wrap">
      <SiteNav current="bulletins" />
      <main id="main" className="not-found">
        <p className="load-line">ready. error 404</p>
        <h1>Bulletin not found</h1>
        <p>That post is not on this board.</p>
        <p className="not-found-actions">
          <Link to="/bulletins">← All bulletins</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  ),
})

function BulletinDetailPage() {
  const { bulletin } = Route.useLoaderData()
  const path = `/bulletins/${bulletin.slug}`
  const topicsLabel = formatTopics(bulletin.topics)

  return (
    <div className="article-shell">
      <JsonLd
        data={blogPostingJsonLd({
          title: bulletin.title,
          description: bulletin.excerpt,
          path,
          image: bulletin.hero.startsWith('/') ? bulletin.hero : '/og.png',
          datePublished: bulletin.date,
        })}
      />
      <div className="wrap">
        <SiteNav current="bulletins" />
        <Link to="/bulletins" className="back-link">
          ← All bulletins
        </Link>
      </div>

      <div className="article-hero">
        <img
          src={bulletin.hero}
          alt=""
          width={1600}
          height={450}
          // Decorative banner; title is in the page heading
        />
      </div>

      <div className="wrap">
        <main id="main">
          <p className="article-meta-bar">
            {formatBulletinDate(bulletin.date)} · {bulletin.id} · {topicsLabel}
          </p>
          <h1 className="article-title">{bulletin.title}</h1>
          <p className="article-excerpt">{bulletin.excerpt}</p>

          <article className="bulletin-prose prose prose-lg prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{bulletin.body}</ReactMarkdown>
          </article>

          {bulletin.canonical ? (
            <aside className="article-source" aria-label="Original publication">
              <div className="article-source-label">Originally published</div>
              <a
                className="article-source-link"
                href={bulletin.canonical}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="article-source-icon" aria-hidden="true">
                  M
                </span>
                <span className="article-source-text">
                  <span className="article-source-name">Medium</span>
                  <span className="article-source-hint">Read the original post →</span>
                </span>
              </a>
            </aside>
          ) : null}
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
