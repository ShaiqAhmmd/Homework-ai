'use client'
import { useState } from 'react'
import SuggestionButtons from './MainSection/SuggestionButtons'
import QuestionForm from './MainSection/QuestionForm'
import ResponseStyleButtons from './MainSection/ResponseStyleButtons'
import TipsCard from './MainSection/TipsCard'

export default function MainSection() {
  // Shared state
  const [question, setQuestion] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(0)
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const styles = [
    'Step-by-step Explanation',
    'Math Equation Breakdown',
    'Essay/Passage Summarization',
    'Friendly Tutor Mode',
  ]

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setAnswer(null)
    try {
      const res = await fetch('/api/ai-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          style: styles[selectedStyle],
        }),
      })
      const data = await res.json()
      if (data.answer) setAnswer(data.answer)
      else setError(data.error || 'No answer received.')
    } catch (err) {
      setError('Failed to get AI answer.')
      // Optionally log the error for debugging:
      // console.error(err);
    }
    setLoading(false)
  }

  return (
    <section className="space-y-10">
      {/* Top Title + Suggestions */}
      <div className="bg-white rounded-xl shadow p-8 mb-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          How can I help with your homework today?
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          Paste your question, upload an image, or try one of our examples below:
        </p>
        <SuggestionButtons />
      </div>

      {/* Form Inputs */}
      <div className="flex flex-col md:flex-row gap-10 max-w-5xl mx-auto">
        <div className="md:w-2/3 space-y-6">
          <QuestionForm question={question} setQuestion={setQuestion} />
          {/* Show AI answer here */}
          {answer && (
            <div className="bg-white border rounded-md p-4 mt-4 text-gray-800 whitespace-pre-line">
              <b>AI Answer:</b>
              <div>{answer}</div>
            </div>
          )}
          {error && (
            <div className="text-red-500 mt-2">{error}</div>
          )}
        </div>
        <div className="md:w-1/3 space-y-6">
          <ResponseStyleButtons
            selected={selectedStyle}
            setSelected={setSelectedStyle}
            loading={loading}
            onGenerate={handleGenerate}
            disabled={!question}
          />
        </div>
      </div>

      <TipsCard />
    </section>
  )
}