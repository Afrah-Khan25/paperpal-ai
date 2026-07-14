import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

function DifficultyBar({ score }) {
  const color = score < 40 ? 'var(--green)' : score < 70 ? 'var(--gold)' : 'var(--red)'
  const label = score < 40 ? 'Beginner Friendly' : score < 70 ? 'Intermediate' : 'Advanced'
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--cream-dim)' }}>{label}</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color }}>{score}/100</span>
      </div>
      <div className="difficulty-bar">
        <div className="difficulty-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--ink-2)', border: '1px solid var(--ink-4)',
      padding: '1.5rem', borderRadius: '2px', ...style
    }}>
      {children}
    </div>
  )
}

function CardTitle({ children }) {
  return (
    <div style={{
      fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '1rem',
      paddingBottom: '0.75rem', borderBottom: '1px solid var(--ink-4)'
    }}>
      {children}
    </div>
  )
}

export default function Results({ data, onReset }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [asking, setAsking] = useState(false)
  const [flashcards, setFlashcards] = useState([])
  const [loadingCards, setLoadingCards] = useState(false)
  const [flipped, setFlipped] = useState({})
  const [activeTab, setActiveTab] = useState('summary')
  const answerRef = useRef(null)

  useEffect(() => {
    if (answer && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [answer])

  const askQuestion = async () => {
    if (!question.trim()) return
    setAsking(true)
    setAnswer('')
    try {
      const res = await axios.post('/api/ask', {
        paper_id: data.paper_id, question
      })
      setAnswer(res.data.answer)
    } catch {
      setAnswer('Could not get an answer. Please try again.')
    } finally {
      setAsking(false)
    }
  }

  const loadFlashcards = async () => {
    if (flashcards.length) { setActiveTab('flashcards'); return }
    setLoadingCards(true)
    setActiveTab('flashcards')
    try {
      const res = await axios.get(`/api/flashcards/${data.paper_id}`)
      setFlashcards(res.data.flashcards)
    } catch {
      setFlashcards([{ term: 'Error', definition: 'Could not load flashcards.' }])
    } finally {
      setLoadingCards(false)
    }
  }

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'contributions', label: 'Contributions' },
    { id: 'qa', label: 'Ask AI' },
    { id: 'flashcards', label: 'Flashcards', onClick: loadFlashcards },
  ]

  return (
    <section className="results-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-label">Analysis Complete</span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, maxWidth: '600px', lineHeight: 1.3 }}>
            {data.title}
          </h2>
        </div>
        <button onClick={onReset} className="btn-ghost">
          ← New Paper
        </button>
      </div>

      <div className="results-grid">
        <Card>
          <CardTitle>Difficulty Score</CardTitle>
          <DifficultyBar score={data.difficulty_score} />
        </Card>
        <Card>
          <CardTitle>Related Topics</CardTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {data.related_topics.map((t, i) => (
              <span key={i} className="topic-pill">{t}</span>
            ))}
          </div>
        </Card>
      </div>

      <div className="tab-bar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); tab.onClick?.() }}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <Card>
            <CardTitle>Plain English Summary</CardTitle>
            <p style={{ color: 'var(--cream)', lineHeight: 1.8, fontSize: '0.95rem' }}>{data.summary}</p>
          </Card>
          <Card>
            <CardTitle>Methodology</CardTitle>
            <p style={{ color: 'var(--cream-dim)', lineHeight: 1.8, fontSize: '0.9rem' }}>{data.methodology}</p>
          </Card>
          <Card>
            <CardTitle>Limitations</CardTitle>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {data.limitations.map((l, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', color: 'var(--cream-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--red)', flexShrink: 0 }}>✕</span> {l}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {activeTab === 'contributions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.key_contributions.map((c, i) => (
            <div key={i} className="contribution-card">
              <span className="contribution-num">{String(i + 1).padStart(2, '0')}</span>
              <p style={{ color: 'var(--cream)', lineHeight: 1.7, fontSize: '0.95rem' }}>{c}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'qa' && (
        <Card>
          <CardTitle>Ask Anything About This Paper</CardTitle>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }} className="qa-input-row">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askQuestion()}
              placeholder="e.g. What dataset was used? What is the main novelty?"
              className="qa-input"
            />
            <button onClick={askQuestion} disabled={asking} className="btn-gold">
              {asking ? '...' : 'Ask →'}
            </button>
          </div>
          {answer && (
            <div ref={answerRef} className="qa-answer">
              {answer}
            </div>
          )}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['What is the main contribution?', 'What dataset was used?', 'What are the limitations?'].map(q => (
              <button key={q} onClick={() => setQuestion(q)} className="suggested-q">
                {q}
              </button>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'flashcards' && (
        <div>
          {loadingCards ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner" />
              <p style={{ color: 'var(--cream-dim)', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem' }}>Generating flashcards...</p>
            </div>
          ) : (
            <div className="flashcard-grid">
              {flashcards.map((card, i) => (
                <div
                  key={i}
                  onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}
                  className={`flashcard ${flipped[i] ? 'flashcard-flipped' : ''}`}
                >
                  {flipped[i] ? (
                    <p style={{ color: 'var(--cream)', lineHeight: 1.7, fontSize: '0.9rem' }}>{card.definition}</p>
                  ) : (
                    <>
                      <span className="flashcard-label">TERM</span>
                      <p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '1rem' }}>{card.term}</p>
                      <span className="flashcard-hint">click to reveal →</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
