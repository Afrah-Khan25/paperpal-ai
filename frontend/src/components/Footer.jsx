export default function Footer() {
  return (
    <footer style={{
      background: 'var(--ink-2)', borderTop: '1px solid var(--gold-dim)',
      padding: '3rem 2rem', textAlign: 'center'
    }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        <span style={{ color: 'var(--gold)' }}>Paper</span>
        <span style={{ color: 'var(--cream)', fontStyle: 'italic' }}>Pal</span>
        <span style={{ color: 'var(--gold-dim)' }}> AI</span>
      </div>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--gold-dim)', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
        MCA FINAL YEAR PROJECT · DAYANANDA SAGAR UNIVERSITY · 2024–25
      </p>
      <div className="gold-line" style={{ maxWidth: '300px', margin: '0 auto 1.5rem' }} />
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--ink-4)', letterSpacing: '0.08em' }}>
        © 2025 PAPERPAL AI · BUILT WITH CLAUDE AI + FASTAPI + REACT
      </p>
    </footer>
  )
}
