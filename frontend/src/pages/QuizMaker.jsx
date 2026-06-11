import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './QuizMaker.css'
import { API as APIS } from '../api'

const API = APIS.quizzes

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return <div className={`toast toast-${type}`}>{type === 'success' ? '✅' : '❌'} {msg}</div>
}

export default function QuizMaker() {
  const [view, setView]         = useState('list') // list | take | result | create
  const [quizzes, setQuizzes]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeQuiz, setActive] = useState(null)
  const [answers, setAnswers]   = useState([])
  const [current, setCurrent]   = useState(0)
  const [result, setResult]     = useState(null)
  const [toast, setToast]       = useState(null)
  const [userName, setUserName] = useState('')

  const fetchQuizzes = async () => {
    try { const { data } = await axios.get(API); setQuizzes(data) } catch { setQuizzes([]) }
    setLoading(false)
  }
  useEffect(() => { fetchQuizzes() }, [])

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const startQuiz = async (id) => {
    try {
      const { data } = await axios.get(`${API}/${id}?mode=take`)
      setActive(data); setAnswers(new Array(data.questions.length).fill(null))
      setCurrent(0); setResult(null); setView('take')
    } catch { showToast('Could not load quiz', 'error') }
  }

  const selectAnswer = (qi, ai) => {
    setAnswers(a => { const n = [...a]; n[qi] = ai; return n })
  }

  const submitQuiz = async () => {
    if (answers.some(a => a === null)) { showToast('Please answer all questions first', 'error'); return }
    try {
      const { data } = await axios.post(`${API}/${activeQuiz.id}/submit`, { answers, userName: userName || 'Anonymous' })
      setResult(data); setView('result'); fetchQuizzes()
    } catch { showToast('Submission failed. Is the backend running?', 'error') }
  }

  const handleCreateQuiz = async (quiz) => {
    try {
      await axios.post(API, quiz)
      showToast('Quiz created successfully!')
      setView('list'); fetchQuizzes()
    } catch { showToast('Failed to create quiz', 'error') }
  }

  const handleDelete = async (id) => {
    try { await axios.delete(`${API}/${id}`); showToast('Quiz deleted'); fetchQuizzes() }
    catch { showToast('Delete failed', 'error') }
  }

  return (
    <div className="qm-page">
      <div className="page-nav">
        <div className="page-nav-inner">
          <div className="page-nav-logo">📝 QuizMaker</div>
          <div className="page-nav-right">
            {view === 'list' && <button className="btn btn-primary btn-sm" onClick={() => setView('create')}>+ Create Quiz</button>}
            {view !== 'list' && <button className="btn btn-secondary btn-sm" onClick={() => { setView('list'); setActive(null); setResult(null) }}>← All Quizzes</button>}
            <Link to="/" className="back-link">← Home</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>

        {/* LIST */}
        {view === 'list' && (
          <div className="qm-list-view">
            <div style={{ marginBottom: 32 }}>
              <p className="sec-label">Online Quiz Maker</p>
              <h1 className="sec-title">Browse & Take Quizzes</h1>
              <p className="sec-desc">Create quizzes with multiple-choice questions. Share them and track scores.</p>
            </div>
            {loading ? <div className="loader" /> : (
              <div className="qm-quiz-grid">
                {quizzes.map(q => (
                  <div key={q.id} className="qm-quiz-card card">
                    <div className="qm-quiz-header">
                      <div>
                        <h3>{q.title}</h3>
                        <p>{q.description}</p>
                      </div>
                      <button className="btn btn-danger btn-sm" style={{ flexShrink: 0 }} onClick={() => handleDelete(q.id)}>×</button>
                    </div>
                    <div className="qm-quiz-meta">
                      <span>❓ {q.questionCount} Questions</span>
                      <span>📊 {q.submissionCount} Attempts</span>
                      <span>✍️ {q.author}</span>
                    </div>
                    <button className="btn btn-primary btn-full" onClick={() => startQuiz(q.id)}>Take Quiz →</button>
                  </div>
                ))}
                {quizzes.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No quizzes yet</h3>
                    <p>Create your first quiz to get started!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAKE QUIZ */}
        {view === 'take' && activeQuiz && (
          <div className="qm-take-view">
            <div className="qm-take-header">
              <h2>{activeQuiz.title}</h2>
              <div className="qm-progress-bar">
                <div className="qm-progress-fill" style={{ width: `${((current + 1) / activeQuiz.questions.length) * 100}%` }} />
              </div>
              <p className="qm-progress-text">Question {current + 1} of {activeQuiz.questions.length}</p>
            </div>

            <div className="qm-name-input" style={{ marginBottom: 24 }}>
              <label className="label">Your Name (optional)</label>
              <input className="input" style={{ maxWidth: 300 }} placeholder="Anonymous" value={userName} onChange={e => setUserName(e.target.value)} />
            </div>

            <div className="qm-question-card card-elevated">
              <p className="qm-q-num">Q{current + 1}</p>
              <h3 className="qm-q-text">{activeQuiz.questions[current].question}</h3>
              <div className="qm-options">
                {activeQuiz.questions[current].options.map((opt, oi) => (
                  <button
                    key={oi}
                    className={`qm-option ${answers[current] === oi ? 'selected' : ''}`}
                    onClick={() => selectAnswer(current, oi)}
                  >
                    <span className="qm-opt-letter">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </button>
                ))}
              </div>
              <div className="qm-q-nav">
                <button className="btn btn-secondary" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>← Previous</button>
                {current < activeQuiz.questions.length - 1
                  ? <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)}>Next →</button>
                  : <button className="btn btn-primary" onClick={submitQuiz}>Submit Quiz ✓</button>
                }
              </div>
            </div>

            <div className="qm-q-dots">
              {activeQuiz.questions.map((_, i) => (
                <button key={i} className={`qm-dot ${i === current ? 'active' : ''} ${answers[i] !== null ? 'answered' : ''}`} onClick={() => setCurrent(i)}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {view === 'result' && result && (
          <div className="qm-result-view">
            <div className="qm-result-card card-elevated">
              <div className="qm-score-circle">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke={result.percentage >= 80 ? 'var(--a3)' : result.percentage >= 50 ? 'var(--yellow)' : 'var(--red)'} strokeWidth="8"
                    strokeDasharray={`${(result.percentage / 100) * 339} 339`} strokeLinecap="round" strokeDashoffset="84.75" transform="rotate(-90 60 60)" />
                </svg>
                <div className="qm-score-inner">
                  <span className="qm-score-pct">{result.percentage}%</span>
                  <span className="qm-score-frac">{result.score}/{result.total}</span>
                </div>
              </div>
              <h2>{result.percentage >= 80 ? '🎉 Excellent!' : result.percentage >= 50 ? '👍 Good Job!' : '📚 Keep Practicing!'}</h2>
              <p style={{ color: 'var(--muted)', marginBottom: 32 }}>{result.userName} scored {result.score} out of {result.total} questions correctly.</p>

              <div className="qm-review">
                {result.results.map((r, i) => (
                  <div key={i} className={`qm-rev-item ${r.isCorrect ? 'correct' : 'wrong'}`}>
                    <div className="qm-rev-icon">{r.isCorrect ? '✅' : '❌'}</div>
                    <div>
                      <p className="qm-rev-q">Q{i + 1}: {r.question}</p>
                      <p className="qm-rev-yours">Your answer: <strong>{r.chosen || 'Not answered'}</strong></p>
                      {!r.isCorrect && <p className="qm-rev-correct">Correct: <strong>{r.correct}</strong></p>}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-full" style={{ marginTop: 24 }} onClick={() => setView('list')}>← Back to Quizzes</button>
            </div>
          </div>
        )}

        {/* CREATE */}
        {view === 'create' && <CreateQuizForm onSubmit={handleCreateQuiz} onCancel={() => setView('list')} />}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function CreateQuizForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc]   = useState('')
  const [author, setAuthor] = useState('Suresh Gopi V')
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correct: 0 }])
  const [loading, setLoading] = useState(false)

  const addQ = () => setQuestions(qs => [...qs, { question: '', options: ['', '', '', ''], correct: 0 }])
  const removeQ = i => setQuestions(qs => qs.filter((_, qi) => qi !== i))
  const setQ = (i, k, v) => setQuestions(qs => qs.map((q, qi) => qi === i ? { ...q, [k]: v } : q))
  const setOpt = (qi, oi, v) => setQuestions(qs => qs.map((q, i) => i === qi ? { ...q, options: q.options.map((o, j) => j === oi ? v : o) } : q))

  const handleSubmit = async e => {
    e.preventDefault()
    if (questions.some(q => !q.question || q.options.some(o => !o))) { alert('Please fill all questions and options'); return }
    setLoading(true)
    await onSubmit({ title, description: desc, author, questions })
    setLoading(false)
  }

  return (
    <div className="qm-create">
      <p className="sec-label">Create</p>
      <h2 className="sec-title">Build a New Quiz</h2>
      <form className="qm-create-form" onSubmit={handleSubmit}>
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h4 style={{ marginBottom: 16, fontWeight: 700 }}>Quiz Details</h4>
          <div className="grid-2">
            <div className="form-group"><label className="label">Quiz Title *</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. JavaScript Basics" /></div>
            <div className="form-group"><label className="label">Author</label><input className="input" value={author} onChange={e => setAuthor(e.target.value)} /></div>
          </div>
          <div className="form-group" style={{ marginTop: 12 }}><label className="label">Description</label><input className="input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description of this quiz" /></div>
        </div>

        {questions.map((q, qi) => (
          <div key={qi} className="card" style={{ padding: 24, marginBottom: 14 }}>
            <div className="flex-between" style={{ marginBottom: 14 }}>
              <h4 style={{ fontWeight: 700 }}>Question {qi + 1}</h4>
              {questions.length > 1 && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQ(qi)}>Remove</button>}
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="label">Question *</label>
              <input className="input" value={q.question} onChange={e => setQ(qi, 'question', e.target.value)} required placeholder="Type the question here…" />
            </div>
            <div className="qm-options-grid">
              {q.options.map((opt, oi) => (
                <div key={oi} className="form-group">
                  <label className="label">Option {String.fromCharCode(65 + oi)} {oi === q.correct && <span style={{ color: 'var(--a3)' }}>✓ Correct</span>}</label>
                  <div className="flex-row" style={{ gap: 8 }}>
                    <input className="input" value={opt} onChange={e => setOpt(qi, oi, e.target.value)} required placeholder={`Option ${String.fromCharCode(65 + oi)}`} />
                    <button type="button" className={`btn btn-sm ${oi === q.correct ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setQ(qi, 'correct', oi)}>✓</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex-row" style={{ gap: 12, marginBottom: 24 }}>
          <button type="button" className="btn btn-secondary" onClick={addQ}>+ Add Question</button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginLeft: 'auto' }}>{loading ? 'Creating…' : 'Create Quiz →'}</button>
        </div>
      </form>
    </div>
  )
}
