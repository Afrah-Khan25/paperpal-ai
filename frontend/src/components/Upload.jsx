import { useState, useCallback } from 'react'
import axios from 'axios'

export default function Upload({ onResult }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFile = useCallback(async (file) => {
    if (!file || !file.name.endsWith('.pdf')) {
      setError('Please upload a valid PDF file.')
      return
    }
    setError('')
    setFileName(file.name)
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await axios.post('/api/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [onResult])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const onInputChange = (e) => handleFile(e.target.files[0])

  return (
    <section id="upload" style={{ padding: '6rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
      <span id="demo" style={{ display: 'block', marginTop: '-5rem', paddingTop: '5rem' }} aria-hidden="true" />
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="section-label">Get Started</span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: '1rem' }}>
          Upload Your <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Paper</span>
        </h2>
        <p style={{ color: 'var(--cream-dim)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Drop any research paper PDF and get an instant AI-powered breakdown in seconds.
        </p>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? 'var(--gold)' : 'var(--ink-4)'}`,
          borderRadius: '2px',
          padding: '4rem 2rem',
          textAlign: 'center',
          background: dragging ? 'rgba(201,168,76,0.04)' : 'var(--ink-2)',
          transition: 'all 0.2s',
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={() => !loading && document.getElementById('pdf-input').click()}
      >
        <input id="pdf-input" type="file" accept=".pdf" onChange={onInputChange} style={{ display: 'none' }} />

        {loading ? (
          <div>
            <div style={{
              width: '40px', height: '40px', border: '3px solid var(--ink-4)',
              borderTop: '3px solid var(--gold)', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem'
            }} />
            <p style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>
              Analyzing {fileName}...
            </p>
            <p style={{ color: 'var(--cream-dim)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Gemini AI is reading your paper
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <p style={{ color: 'var(--cream)', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              {fileName || 'Drop your PDF here'}
            </p>
            <p style={{ color: 'var(--cream-dim)', fontSize: '0.85rem' }}>
              or click to browse files
            </p>
            <div style={{
              marginTop: '1.5rem', fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
              color: 'var(--gold-dim)', letterSpacing: '0.1em'
            }}>
              PDF · MAX 20MB
            </div>
          </div>
        )}
      </div>

      {error && (
        <div         style={{
          marginTop: '1rem', padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--red) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--red) 30%, transparent)',
          color: 'var(--red)', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem'
        }}>
          ⚠ {error}
        </div>
      )}
    </section>
  )
}
