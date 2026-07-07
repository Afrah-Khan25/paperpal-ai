const steps = [
  { num: '01', icon: '📤', title: 'Upload PDF', desc: 'Drop any research paper PDF into PaperPal. We extract the full text using PyMuPDF.' },
  { num: '02', icon: '🔍', title: 'Text Extraction', desc: 'PyMuPDF parses every page and sends the content to our FastAPI backend pipeline.' },
  { num: '03', icon: '🤖', title: 'Claude AI Analysis', desc: 'Claude reads the paper and generates summaries, contributions, limitations, and flashcards.' },
  { num: '04', icon: '💡', title: 'Instant Insights', desc: 'Results appear in seconds. Ask follow-up questions via our RAG-powered Q&A interface.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '6rem 2rem', background: 'var(--ink-2)', borderTop: '1px solid var(--ink-4)', borderBottom: '1px solid var(--ink-4)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">Architecture</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700 }}>
            How <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>PaperPal</span> Works
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0', position: 'relative' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0' }}>
              <div style={{
                background: 'var(--ink-3)', border: '1px solid var(--ink-4)',
                padding: '2rem 1.5rem', flex: 1,
                borderTop: '3px solid var(--gold-dim)',
                transition: 'all 0.25s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderTopColor = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.borderTopColor = 'var(--gold-dim)'}
              >
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--gold-dim)', marginBottom: '0.75rem' }}>{s.num}</div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>{s.title}</h3>
                <p style={{ color: 'var(--cream-dim)', fontSize: '0.85rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.25rem', color: 'var(--gold-dim)', fontSize: '1.2rem', alignSelf: 'center' }}>→</div>
              )}
            </div>
          ))}
        </div>

        {/* Tech Stack pills */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--gold-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Powered By</div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['React + Vite', 'FastAPI', 'Claude AI', 'PyMuPDF', 'Python 3.11', 'RAG Architecture'].map(t => (
              <span key={t} style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', padding: '5px 14px',
                border: '1px solid var(--gold-dim)', color: 'var(--gold)', background: 'rgba(201,168,76,0.05)'
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
