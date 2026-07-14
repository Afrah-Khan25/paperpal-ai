export default function Ticker() {
  const items = [
    'PDF Intelligence', 'Plain English Summaries', 'Key Contributions',
    'Limitations Analysis', 'AI Flashcards', 'Interactive Q&A',
    'Methodology Explainer', 'Difficulty Scoring'
  ]
  const repeated = [...items, ...items]

  return (
    <div style={{
      borderTop: '1px solid var(--gold-dim)', borderBottom: '1px solid var(--gold-dim)',
      background: 'var(--ink-2)', overflow: 'hidden', padding: '0.75rem 0'
    }}>
      <div style={{
        display: 'flex', gap: '3rem', width: 'max-content',
        animation: 'ticker 30s linear infinite'
      }}>
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
            color: 'var(--gold-dim)', textTransform: 'uppercase', letterSpacing: '0.12em',
            whiteSpace: 'nowrap'
          }}>
            {item} <span style={{ color: 'var(--gold)', margin: '0 0.5rem' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
