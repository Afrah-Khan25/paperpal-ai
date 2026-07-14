import { useEffect, useRef } from 'react'

export default function Hero({ onCTAClick }) {
  const ref = useRef()

  useEffect(() => {
    setTimeout(() => ref.current?.classList.add('visible'), 100)
  }, [])

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '8rem 2rem 4rem',
      background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Letterbox bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: 'var(--ink)', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'var(--ink)', zIndex: 2 }} />

      <div ref={ref} className="fade-up" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ height: '1px', width: '60px', background: 'var(--gold-dim)' }} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--gold-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Research Paper Intelligence · 2024–25
          </span>
          <div style={{ height: '1px', width: '60px', background: 'var(--gold-dim)' }} />
        </div>

        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--cream)' }}>Paper</span>
          <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Pal</span>
          <span style={{ color: 'var(--cream)' }}> AI</span>
        </h1>

        <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'var(--gold-dim)', marginBottom: '1.5rem' }}>
          Upload. Understand. Master Any Research Paper.
        </p>

        <p style={{ fontSize: '1rem', color: 'var(--cream-dim)', maxWidth: '560px', margin: '0 auto 3rem', lineHeight: 1.8, fontWeight: 300 }}>
          PaperPal AI transforms dense academic papers into plain English summaries, key insights, flashcards, and an interactive Q&A — powered by Gemini AI.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onCTAClick} style={{
            background: 'var(--gold)', color: 'var(--ink)', border: 'none',
            padding: '0.9rem 2.2rem', fontFamily: 'Outfit, sans-serif', fontWeight: 600,
            fontSize: '0.95rem', cursor: 'pointer', letterSpacing: '0.05em',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.target.style.background = 'var(--gold-light)'; e.target.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.target.style.background = 'var(--gold)'; e.target.style.transform = 'translateY(0)' }}
          >
            Upload a Paper →
          </button>
          <a href="#how-it-works" style={{
            background: 'transparent', color: 'var(--gold)', border: '1px solid var(--gold-dim)',
            padding: '0.9rem 2.2rem', fontFamily: 'Outfit, sans-serif', fontWeight: 400,
            fontSize: '0.95rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.target.style.borderColor = 'var(--gold)'}
          onMouseLeave={e => e.target.style.borderColor = 'var(--gold-dim)'}
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  )
}
