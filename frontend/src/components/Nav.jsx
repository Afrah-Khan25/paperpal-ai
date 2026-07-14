import { useState, useEffect } from 'react'

const LINKS = [
  { label: 'Upload', href: '#upload' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Demo', href: '#demo' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-logo">
        <span className="gold">Paper</span>
        <span className="nav-logo-italic">Pal</span>
        <span className="nav-logo-ai">AI</span>
      </div>

      <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="nav-link"
            onClick={closeMenu}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="nav-badge">MCA Final Year · 2025</div>

      <button
        className={`nav-toggle ${menuOpen ? 'nav-toggle-open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  )
}
