import { useEffect, useRef } from 'react'

const steps = [
  { num: '01', icon: '📤', title: 'Upload PDF', desc: 'Drop any research paper PDF into PaperPal. We extract the full text using PyMuPDF.' },
  { num: '02', icon: '🔍', title: 'Text Extraction', desc: 'PyMuPDF parses every page and sends the content to our FastAPI backend pipeline.' },
  { num: '03', icon: '🤖', title: 'Gemini AI Analysis', desc: 'Gemini reads the paper and generates summaries, contributions, limitations, and flashcards.' },
  { num: '04', icon: '💡', title: 'Instant Insights', desc: 'Results appear in seconds. Ask follow-up questions via our RAG-powered Q&A interface.' },
]

const STACK = ['React + Vite', 'FastAPI', 'Gemini AI', 'PyMuPDF', 'Python 3.11', 'RAG Architecture']

export default function HowItWorks() {
  const refs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    refs.current.forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="how-it-works" style={{ padding: '6rem 2rem', background: 'var(--ink-2)', borderTop: '1px solid var(--ink-4)', borderBottom: '1px solid var(--ink-4)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div ref={el => refs.current[0] = el} className="fade-up" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">Architecture</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700 }}>
            How <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>PaperPal</span> Works
          </h2>
        </div>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} ref={el => refs.current[i + 1] = el} className="fade-up step-item" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="step-card">
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--gold-dim)', marginBottom: '0.75rem' }}>{s.num}</div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>{s.title}</h3>
                <p style={{ color: 'var(--cream-dim)', fontSize: '0.85rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
              {i < steps.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>

        <div ref={el => refs.current[5] = el} className="fade-up" style={{ marginTop: '3rem', textAlign: 'center', transitionDelay: '0.4s' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--gold-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Powered By</div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {STACK.map(t => (
              <span key={t} className="stack-pill">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
