import { useState, useEffect } from 'react'
import axios from 'axios'

function DifficultyBar({ score }) {
  const color = score < 40 ? '#4CAF7A' : score < 70 ? 'var(--gold)' : 'var(--red)'
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

  const askQuestion = async () => {
    if (!question.trim()) return
    setAsking(true)
    setAnswer('')
    try {
      const res = await axios.post('http://localhost:8000/api/ask', {
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
      const res = await axios.get(`http://localhost:8000/api/flashcards/${data.paper_id}`)
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
    <section style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-label">Analysis Complete</span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, maxWidth: '600px', lineHeight: 1.3 }}>
            {data.title}
          </h2>
        </div>
        <button onClick={onReset} style={{
          background: 'transparent', border: '1px solid var(--ink-4)', color: 'var(--cream-dim)',
          padding: '0.5rem 1.2rem', cursor: 'pointer', fontFamily: 'DM Mono, monospace',
          fontSize: '0.75rem', letterSpacing: '0.08em', transition: 'all 0.2s'
        }}
        onMouseEnter={e => e.target.style.borderColor = 'var(--gold-dim)'}
        onMouseLeave={e => e.target.style.borderColor = 'var(--ink-4)'}
        >
          ← New Paper
        </button>
      </div>

      {/* Difficulty + Topics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <Card>
          <CardTitle>Difficulty Score</CardTitle>
          <DifficultyBar score={data.difficulty_score} />
        </Card>
        <Card>
          <CardTitle>Related Topics</CardTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {data.related_topics.map((t, i) => (
              <span key={i} style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', padding: '3px 10px',
                border: '1px solid var(--ink-4)', color: 'var(--cream-dim)',
                background: 'var(--ink-3)'
              }}>{t}</span>
            ))}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--ink-4)', marginBottom: '1.5rem', gap: '0' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); tab.onClick?.() }} style={{
            background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
            color: activeTab === tab.id ? 'var(--gold)' : 'var(--cream-dim)',
            padding: '0.75rem 1.5rem', cursor: 'pointer', fontFamily: 'DM Mono, monospace',
            fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase',
            transition: 'all 0.2s', marginBottom: '-1px'
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
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
            <div key={i} style={{
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
              background: 'var(--ink-2)', border: '1px solid var(--ink-4)',
              padding: '1.2rem 1.5rem', borderLeft: '3px solid var(--gold)'
            }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--gold-dim)', flexShrink: 0, paddingTop: '2px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p style={{ color: 'var(--cream)', lineHeight: 1.7, fontSize: '0.95rem' }}>{c}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'qa' && (
        <Card>
          <CardTitle>Ask Anything About This Paper</CardTitle>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askQuestion()}
              placeholder="e.g. What dataset was used? What is the main novelty?"
              style={{
                flex: 1, background: 'var(--ink-3)', border: '1px solid var(--ink-4)',
                color: 'var(--cream)', padding: '0.75rem 1rem', fontFamily: 'Outfit, sans-serif',
                fontSize: '0.9rem', outline: 'none'
              }}
            />
            <button onClick={askQuestion} disabled={asking} style={{
              background: asking ? 'var(--ink-4)' : 'var(--gold)', color: 'var(--ink)',
              border: 'none', padding: '0.75rem 1.5rem', cursor: asking ? 'not-allowed' : 'pointer',
              fontWeight: 600, fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', transition: 'all 0.2s'
            }}>
              {asking ? '...' : 'Ask →'}
            </button>
          </div>
          {answer && (
            <div style={{
              background: 'var(--ink-3)', padding: '1.2rem', borderLeft: '2px solid var(--gold)',
              color: 'var(--cream)', lineHeight: 1.8, fontSize: '0.9rem'
            }}>
              {answer}
            </div>
          )}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['What is the main contribution?', 'What dataset was used?', 'What are the limitations?'].map(q => (
              <button key={q} onClick={() => setQuestion(q)} style={{
                background: 'transparent', border: '1px solid var(--ink-4)', color: 'var(--cream-dim)',
                padding: '4px 12px', cursor: 'pointer', fontFamily: 'DM Mono, monospace',
                fontSize: '0.65rem', letterSpacing: '0.05em', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--gold-dim)'; e.target.style.color = 'var(--gold)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--ink-4)'; e.target.style.color = 'var(--cream-dim)' }}
              >{q}</button>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'flashcards' && (
        <div>
          {loadingCards ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{
                width: '32px', height: '32px', border: '2px solid var(--ink-4)',
                borderTop: '2px solid var(--gold)', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem'
              }} />
              <p style={{ color: 'var(--cream-dim)', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem' }}>Generating flashcards...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {flashcards.map((card, i) => (
                <div key={i} onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))} style={{
                  background: flipped[i] ? 'rgba(201,168,76,0.08)' : 'var(--ink-2)',
                  border: `1px solid ${flipped[i] ? 'var(--gold-dim)' : 'var(--ink-4)'}`,
                  padding: '1.5rem', cursor: 'pointer', minHeight: '120px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  transition: 'all 0.25s', borderRadius: '2px'
                }}>
                  {flipped[i] ? (
                    <p style={{ color: 'var(--cream)', lineHeight: 1.7, fontSize: '0.9rem' }}>{card.definition}</p>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--gold-dim)', marginBottom: '0.5rem' }}>TERM</span>
                      <p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '1rem' }}>{card.term}</p>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--cream-dim)', marginTop: '0.75rem' }}>click to reveal →</span>
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
