import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Upload', 'Features', 'How It Works', 'Demo']

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '1rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(10,9,8,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
      transition: 'all 0.3s ease'
    }}>
      {/* Logo */}
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700 }}>
        <span style={{ color: 'var(--gold)' }}>Paper</span>
        <span style={{ color: 'var(--cream)', fontStyle: 'italic' }}>Pal</span>
        <span style={{ color: 'var(--gold-dim)', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', marginLeft: '8px', verticalAlign: 'middle' }}>AI</span>
      </div>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '2rem' }} className="nav-links">
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} style={{
            color: 'var(--cream-dim)', textDecoration: 'none', fontSize: '0.85rem',
            fontFamily: 'Outfit, sans-serif', transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.target.style.color = 'var(--gold)'}
          onMouseLeave={e => e.target.style.color = 'var(--cream-dim)'}
          >{l}</a>
        ))}
      </div>

      {/* Badge */}
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em',
        color: 'var(--gold)', border: '1px solid var(--gold-dim)',
        padding: '4px 10px', textTransform: 'uppercase'
      }}>
        MCA Final Year · 2025
      </div>
    </nav>
  )
}
