import { useEffect, useRef } from 'react'

const features = [
  { icon: '🧠', tag: 'NLP Engine', title: 'Plain English Summaries', desc: 'Gemini AI reads the full paper and distills it into clear, jargon-free language anyone can understand — no PhD required.' },
  { icon: '🎯', tag: 'Extraction', title: 'Key Contributions', desc: 'Automatically identifies and highlights what the paper actually contributes to its field, saving hours of reading.' },
  { icon: '💬', tag: 'RAG Q&A', title: 'Ask Anything', desc: 'Chat directly with the paper. Ask specific questions and get accurate answers grounded in the paper\'s actual content.' },
  { icon: '🃏', tag: 'Memory', title: 'AI Flashcards', desc: 'Generate interactive flashcards from key terms and concepts. Flip to reveal definitions and study smarter.' },
  { icon: '📊', tag: 'Metrics', title: 'Difficulty Scoring', desc: 'Understand how complex a paper is before diving in. Color-coded scores help you plan your reading time.' },
  { icon: '⚠️', tag: 'Critical', title: 'Limitations Analysis', desc: 'Surfaces what the paper does not solve or openly acknowledges — critical for academic critique and literature reviews.' },
]

export default function Features() {
  const refs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    refs.current.forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="features" style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="section-label">Capabilities</span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700 }}>
          Everything You Need to <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Master</span> a Paper
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {features.map((f, i) => (
          <div key={i} ref={el => refs.current[i] = el} className="fade-up" style={{ transitionDelay: `${i * 0.08}s` }}>
            <div style={{
              background: 'var(--ink-2)', border: '1px solid var(--ink-4)',
              padding: '1.8rem', height: '100%',
              borderLeft: '3px solid transparent',
              transition: 'all 0.25s', cursor: 'default'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--ink-3)' }}
            onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'var(--ink-2)' }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{f.icon}</div>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em',
                color: 'var(--gold-dim)', textTransform: 'uppercase', border: '1px solid var(--ink-4)',
                padding: '2px 8px', marginBottom: '0.75rem', display: 'inline-block'
              }}>{f.tag}</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.6rem', fontFamily: 'Playfair Display, serif' }}>{f.title}</h3>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
