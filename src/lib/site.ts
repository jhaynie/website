/** Central site identity for SEO, meta, and JSON-LD. */

export const site = {
  name: 'Jeff Haynie',
  handle: '@jhaynie',
  titleDefault: 'Jeff Haynie',
  titleTemplate: '%s · Jeff Haynie',
  description:
    'Founder, builder and 80s computer kid. I write about building software, the future of AI and Agentic Business, and the long arc from a blinking cursor to production systems.',
  locale: 'en_US',
  language: 'en',
  twitter: '@jhaynie',
  email: 'jhaynie@gmail.com',
  avatar: 'https://avatars.githubusercontent.com/u/6027?v=4',
  avatarLocal: '/avatar.jpg',
  links: {
    github: 'https://github.com/jhaynie',
    x: 'https://x.com/jhaynie',
    linkedin: 'https://linkedin.com/in/jhaynie',
    medium: 'https://medium.com/@jhaynie',
  },
} as const

const DEFAULT_SITE_URL = 'https://jhaynie.dev'

/** Production origin without trailing slash. Defaults to https://jhaynie.dev. */
export function getSiteUrl(): string {
  const raw =
    (import.meta.env.VITE_SITE_URL as string | undefined) ||
    (typeof process !== 'undefined' ? process.env.VITE_SITE_URL : undefined) ||
    DEFAULT_SITE_URL
  return raw.replace(/\/$/, '')
}

export function absoluteUrl(path = '/'): string {
  const base = getSiteUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

export function pageTitle(segment?: string): string {
  if (!segment || segment === site.name) return site.titleDefault
  return site.titleTemplate.replace('%s', segment)
}

export type SeoInput = {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}

/** TanStack Router `head` meta + links payload */
export function buildSeoHead(input: SeoInput = {}) {
  const title = input.title ? pageTitle(input.title) : site.titleDefault
  const description = input.description ?? site.description
  const path = input.path ?? '/'
  const canonical = absoluteUrl(path)
  const image = absoluteUrl(input.image ?? '/og.png')
  const type = input.type ?? 'website'

  const meta: Array<Record<string, string>> = [
    { title },
    { name: 'description', content: description },
    { name: 'author', content: site.name },
    { name: 'theme-color', content: '#141214' },
    { name: 'color-scheme', content: 'dark' },
    ...(input.noIndex
      ? [{ name: 'robots', content: 'noindex, nofollow' }]
      : [{ name: 'robots', content: 'index, follow, max-image-preview:large' }]),
    // Open Graph
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: site.name },
    { property: 'og:locale', content: site.locale },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: title },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: site.twitter },
    { name: 'twitter:creator', content: site.twitter },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]

  if (type === 'article') {
    meta.push({ property: 'article:author', content: site.name })
    if (input.publishedTime) {
      meta.push({ property: 'article:published_time', content: input.publishedTime })
    }
    if (input.modifiedTime) {
      meta.push({ property: 'article:modified_time', content: input.modifiedTime })
    }
    for (const tag of input.tags ?? []) {
      meta.push({ property: 'article:tag', content: tag })
    }
  }

  const links: Array<Record<string, string>> = [
    { rel: 'canonical', href: canonical },
  ]

  return { title, description, canonical, image, meta, links }
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: absoluteUrl('/'),
    email: site.email,
    sameAs: [site.links.github, site.links.x, site.links.linkedin, site.links.medium],
    jobTitle: 'Founder & Builder',
    description: site.description,
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl('/'),
    description: site.description,
    author: { '@type': 'Person', name: site.name },
    inLanguage: site.language,
  }
}

export function blogPostingJsonLd(input: {
  title: string
  description: string
  path: string
  image?: string
  datePublished: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: absoluteUrl(input.image ?? '/og.png'),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Person',
      name: site.name,
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Person',
      name: site.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(input.path),
    },
  }
}

export function jsonLdScript(data: unknown) {
  return {
    type: 'application/ld+json' as const,
    children: JSON.stringify(data),
  }
}
