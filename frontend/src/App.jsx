import { useState, useRef } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import Upload from './components/Upload'
import Results from './components/Results'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  const [result, setResult] = useState(null)
  const uploadRef = useRef()

  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleResult = (data) => {
    setResult(data)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
  }

  return (
    <>
      <Nav />
      {!result ? (
        <>
          <Hero onCTAClick={scrollToUpload} />
          <Ticker />
          <Upload onResult={handleResult} />
          <Features />
          <HowItWorks />
        </>
      ) : (
        <div style={{ paddingTop: '5rem' }}>
          <Results data={result} onReset={() => setResult(null)} />
        </div>
      )}
      <Footer />
    </>
  )
}
