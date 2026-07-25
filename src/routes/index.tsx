import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteNav } from '#/components/SiteNav'
import { SiteFooter } from '#/components/SiteFooter'
import { BulletinList } from '#/components/BulletinList'
import { CatalogGrid } from '#/components/CatalogGrid'
import { loadBulletins } from '#/lib/bulletins-fn'
import { buildSeoHead } from '#/lib/site'

export const Route = createFileRoute('/')({
  loader: async () => {
    const all = await loadBulletins()
    return { bulletins: all.slice(0, 3) }
  },
  component: HomePage,
  head: () => {
    const seo = buildSeoHead({ path: '/' })
    return {
      meta: seo.meta,
      links: seo.links,
    }
  },
})

function HomePage() {
  const { bulletins } = Route.useLoaderData()

  return (
    <div className="wrap">
      <SiteNav current="home" />

      <main id="main">
      <header className="hero" id="home">
        <p className="load-line">RUN</p>
        <h1>
          I write about software and being a <em>full-time builder</em>.
        </h1>
        <p className="bio">
          Founder, builder and 80s computer kid. I write about building software, the
          future of AI and Agentic Business, and the long arc from a blinking cursor to
          production systems.
        </p>
      </header>

      <section className="page-section" id="bulletins" aria-labelledby="bulletins-title">
        <div className="manual-head">
          <span className="line-no" aria-hidden="true">100</span>
          <h2 id="bulletins-title">Bulletins</h2>
          <Link to="/bulletins" className="all-link">
            All bulletins →
          </Link>
        </div>
        <BulletinList bulletins={bulletins} filterVariant="quiet" />
      </section>

      <section className="page-section" id="catalog" aria-labelledby="catalog-title">
        <div className="manual-head">
          <span className="line-no" aria-hidden="true">200</span>
          <h2 id="catalog-title">Catalog</h2>
        </div>
        <CatalogGrid />
      </section>

      <section className="page-section" id="sysop" aria-labelledby="sysop-title">
        <div className="manual-head">
          <span className="line-no" aria-hidden="true">300</span>
          <h2 id="sysop-title">Sysop</h2>
        </div>
        <div className="about-strip">
          <div>
            <h2 className="cursor-heading">
              Started with a blinking cursor
              <span className="blink-cursor" aria-hidden="true" />
            </h2>
            <p>
              I grew up in the 1980s. At twelve I was writing programs on a{' '}
              <strong>TRS-80</strong>, a <strong>Commodore 64</strong>, a{' '}
              <strong>TI-99/4A</strong>, and an <strong>Apple //e</strong>. Plastic
              keys, slow disks, and the thrill of something you typed actually running.
            </p>
            <p>
              I also served in the U.S. Navy and am a combat veteran. It isn’t the center of
              this site, but that chapter is part of who I am: it taught me to stay steady,
              do the work carefully, and take responsibility seriously.
            </p>
            <p>
              The programming loop never left. I still build software that feels solid,
              honest, and a little personal, whether it’s a platform, a CLI, or a late-night
              side project.
            </p>
          </div>
          <table className="spec-table">
            <tbody>
              <tr>
                <th>FIRST BOOT</th>
                <td>1983</td>
              </tr>
              <tr>
                <th>MACHINES</th>
                <td>TRS-80 · C64 · TI-99/4A · Apple //e</td>
              </tr>
              <tr>
                <th>SERVICE</th>
                <td>U.S. Navy</td>
              </tr>
              <tr>
                <th>FOCUS</th>
                <td>Platforms, entrepreneurship</td>
              </tr>
              <tr>
                <th>OUTPUT</th>
                <td>Code · bulletins · companies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-section" id="contact" aria-labelledby="contact-title">
        <div className="manual-head">
          <span className="line-no" aria-hidden="true">400</span>
          <h2 id="contact-title">Contact</h2>
        </div>
        <div className="term" role="list">
          <span className="line" role="listitem">
            <span className="prompt">ready.</span>
            <span className="cmd"> open </span>
            <a href="mailto:jhaynie@gmail.com">mailto:jhaynie@gmail.com</a>
          </span>
          <span className="line" role="listitem">
            <span className="prompt">ready.</span>
            <span className="cmd"> open </span>
            <a href="https://github.com/jhaynie" rel="noopener noreferrer">
              https://github.com/jhaynie
            </a>
          </span>
          <span className="line" role="listitem">
            <span className="prompt">ready.</span>
            <span className="cmd"> open </span>
            <a href="https://x.com/jhaynie" rel="noopener noreferrer">
              https://x.com/jhaynie
            </a>
          </span>
          <span className="line" role="listitem">
            <span className="prompt">ready.</span>
            <span className="cmd"> open </span>
            <a href="https://linkedin.com/in/jhaynie" rel="noopener noreferrer">
              https://linkedin.com/in/jhaynie
            </a>
          </span>
        </div>
      </section>
      </main>

      <SiteFooter />
    </div>
  )
}
