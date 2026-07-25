import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { site } from '#/lib/site'

const links = [
  { to: '/', label: 'Home', hash: undefined as string | undefined },
  { to: '/bulletins', label: 'Bulletins', hash: undefined },
  { to: '/', label: 'Catalog', hash: 'catalog' },
  { to: '/', label: 'Sysop', hash: 'sysop' },
  { to: '/', label: 'Contact', hash: 'contact' },
] as const

export function SiteNav({ current }: { current?: 'home' | 'bulletins' }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="site-nav" aria-label="Primary">
      <Link to="/" className="nav-brand">
        <img
          className="nav-avatar"
          src={site.avatarLocal}
          alt=""
          width={40}
          height={40}
          decoding="async"
        />
        <span className="nav-brand-text">
          Jeff Haynie
          <span className="handle">@jhaynie</span>
        </span>
      </Link>
      <button
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="navLinks"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'CLOSE' : 'MENU'}
      </button>
      <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
        {links.map((link) => {
          const isCurrent =
            (current === 'home' && link.label === 'Home') ||
            (current === 'bulletins' && link.label === 'Bulletins')
          return (
            <li key={link.label}>
              <Link
                to={link.to}
                hash={link.hash}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
