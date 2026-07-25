export type CatalogCompany = {
  id: string
  name: string
  years: string
  color: 'dark-blue' | 'cyan' | 'blue' | 'red' | 'green' | 'yellow'
  description: string
  /** Optional public site shown inside the card */
  url?: string
}

/** Newest first (CO-006 → CO-001). */
export const catalog: CatalogCompany[] = [
  {
    id: 'CO-006',
    name: 'The Agent Company',
    years: '2026 —',
    color: 'dark-blue',
    description:
      'Building Genesis, specialized AI for small business: systems you own and put to work, not the other way around.',
    url: 'https://agentcompany.com',
  },
  {
    id: 'CO-005',
    name: 'Agentuity',
    years: '2025 —',
    color: 'cyan',
    description: 'Infrastructure for applications built around AI agents.',
    url: 'https://agentuity.com',
  },
  {
    id: 'CO-004',
    name: 'Pinpoint',
    years: '2017–2022',
    color: 'blue',
    description:
      'Engineering intelligence for software teams: how work moves from idea to shipped code.',
  },
  {
    id: 'CO-003',
    name: 'Appcelerator',
    years: '2006–2016',
    color: 'red',
    description:
      'Open-source cross-platform mobile toolkit (Titanium) and an enterprise mobile platform.',
  },
  {
    id: 'CO-002',
    name: 'Vocalocity',
    years: '2001–2006',
    color: 'green',
    description:
      'Voice telephony platform. Co-author of VoiceXML (W3C) and participant in related IETF work.',
  },
  {
    id: 'CO-001',
    name: 'eHatchery',
    years: '1999–2001',
    color: 'yellow',
    description:
      'Business technology incubator from the late dot-com years, before Y Combinator and the later wave of labs and accelerators.',
  },
]
