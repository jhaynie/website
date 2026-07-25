import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { personJsonLd, site, websiteJsonLd } from '#/lib/site'
import { JsonLd } from '#/components/JsonLd'
import { SiteNav } from '#/components/SiteNav'
import { SiteFooter } from '#/components/SiteFooter'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: site.titleDefault },
      { name: 'description', content: site.description },
      { name: 'author', content: site.name },
      { name: 'theme-color', content: '#141214' },
      { name: 'color-scheme', content: 'dark' },
      { name: 'twitter:site', content: site.twitter },
      { name: 'twitter:creator', content: site.twitter },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'icon', href: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { rel: 'icon', href: '/avatar.jpg', type: 'image/jpeg', sizes: '460x460' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={personJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
        {import.meta.env.DEV ? (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="wrap">
      <SiteNav />
      <main id="main" className="not-found">
        <p className="load-line">ready. error 404</p>
        <h1>Page not found</h1>
        <p>That path is not on this board. Try the homepage or browse bulletins.</p>
        <p className="not-found-actions">
          <Link to="/">← Home</Link>
          <Link to="/bulletins">Bulletins</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
