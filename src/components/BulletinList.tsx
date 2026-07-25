import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { Bulletin, BulletinTopic } from '#/lib/bulletins-shared'
import {
  bulletinMatchesTopic,
  formatBulletinDate,
  formatTopics,
  primaryTopic,
} from '#/lib/bulletins-shared'

const FILTERS: Array<{ id: 'all' | BulletinTopic; label: string }> = [
  { id: 'all', label: 'all' },
  { id: 'agents', label: 'agents' },
  { id: 'coding', label: 'coding' },
  { id: 'business', label: 'business' },
]

const thumbClass = ['t1', 't2', 't3', 't4', 't5', 't6'] as const

function Thumb({
  index,
  topic,
  thumb,
}: {
  index: number
  topic: string
  thumb?: string
}) {
  if (thumb === 'us-flag') {
    return (
      <div className="note-thumb thumb-us-flag" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stylized flag: canton + stripes, soft 80s UI treatment */}
          <rect x="5" y="7" width="22" height="18" rx="2" fill="#1a2744" />
          <rect x="5" y="7" width="10" height="10" rx="1.5" fill="#2f4d8a" />
          {/* stars (dots) */}
          <circle cx="8" cy="10" r="0.7" fill="#e8e4df" />
          <circle cx="11" cy="10" r="0.7" fill="#e8e4df" />
          <circle cx="14" cy="10" r="0.7" fill="#e8e4df" />
          <circle cx="9.5" cy="12.2" r="0.7" fill="#e8e4df" />
          <circle cx="12.5" cy="12.2" r="0.7" fill="#e8e4df" />
          <circle cx="8" cy="14.4" r="0.7" fill="#e8e4df" />
          <circle cx="11" cy="14.4" r="0.7" fill="#e8e4df" />
          <circle cx="14" cy="14.4" r="0.7" fill="#e8e4df" />
          {/* stripes */}
          <rect x="15" y="7" width="12" height="2" fill="#c45c5c" opacity="0.95" />
          <rect x="15" y="11" width="12" height="2" fill="#e8e4df" opacity="0.9" />
          <rect x="15" y="15" width="12" height="2" fill="#c45c5c" opacity="0.95" />
          <rect x="5" y="17" width="22" height="2" fill="#e8e4df" opacity="0.9" />
          <rect x="5" y="21" width="22" height="2" fill="#c45c5c" opacity="0.95" />
          <rect
            x="5"
            y="7"
            width="22"
            height="18"
            rx="2"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
        </svg>
      </div>
    )
  }

  const cls = thumbClass[index % thumbClass.length]
  return (
    <div className={`note-thumb ${cls}`} aria-hidden="true">
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {topic === 'agents' ? (
          <>
            <path d="M8 22V10l8-4 8 4v12l-8 4-8-4z" />
            <path d="M16 6v20M8 10l8 4 8-4" opacity="0.75" />
          </>
        ) : topic === 'business' ? (
          <>
            <rect x="8" y="8" width="16" height="16" rx="2" />
            <path d="M12 8v16M20 8v16M8 12h16M8 20h16" opacity="0.7" />
            <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
          </>
        ) : (
          <>
            <path d="M6 8h8M6 12h14M6 16h10M6 20h12" />
            <rect
              x="20"
              y="18"
              width="5"
              height="8"
              rx="0.5"
              fill="currentColor"
              stroke="none"
              opacity="0.85"
            />
          </>
        )}
      </svg>
    </div>
  )
}

export function BulletinList({
  bulletins,
  initialTopic = 'all',
  /** quiet = mono text channels; pills = filled chips */
  filterVariant = 'quiet',
}: {
  bulletins: Bulletin[]
  initialTopic?: 'all' | BulletinTopic
  filterVariant?: 'pills' | 'quiet'
}) {
  const [topic, setTopic] = useState<'all' | BulletinTopic>(initialTopic)

  const visible = useMemo(() => {
    return bulletins.filter((b) => bulletinMatchesTopic(b, topic))
  }, [bulletins, topic])

  return (
    <>
      <div
        className={
          filterVariant === 'quiet' ? 'filters filters-quiet' : 'filters'
        }
        role="group"
        aria-label="Filter bulletins"
      >
        {FILTERS.map((f, i) => (
          <span key={f.id} className="filter-item">
            {i > 0 && filterVariant === 'quiet' ? (
              <span className="filter-sep" aria-hidden="true">
                ·
              </span>
            ) : null}
            <button
              type="button"
              data-filter={f.id}
              aria-pressed={topic === f.id}
              onClick={() => setTopic(f.id)}
            >
              {f.label}
            </button>
          </span>
        ))}
      </div>

      <div className="notes">
        {visible.map((b, i) => (
          <Link
            key={b.slug}
            to="/bulletins/$slug"
            params={{ slug: b.slug }}
            className="note"
          >
            <Thumb index={i} topic={primaryTopic(b)} thumb={b.thumb} />
            <div>
              <div className="note-meta">
                — {formatBulletinDate(b.date)} · {b.id} · {formatTopics(b.topics)}
              </div>
              <h3>{b.title}</h3>
              <p>{b.excerpt}</p>
            </div>
            <span className="note-go" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="notes-empty is-visible">No bulletins in this filter yet.</p>
      ) : null}
    </>
  )
}
