import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './Calculator.css'

const BUTTONS = [
  ['AC', '+/-', '%', '÷'],
  ['7',  '8',  '9', '×'],
  ['4',  '5',  '6', '−'],
  ['1',  '2',  '3', '+'],
  ['0',       '.', '='],
]

export default function Calculator() {
  const [display, setDisplay]   = useState('0')
  const [prev, setPrev]         = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitNext, setWaitNext] = useState(false)
  const [history, setHistory]   = useState([])

  const handleKey = useCallback((key) => {
    // Digits & dot
    if (!isNaN(key) || key === '.') {
      if (waitNext) {
        setDisplay(key === '.' ? '0.' : key)
        setWaitNext(false)
      } else {
        setDisplay(d => {
          if (key === '.' && d.includes('.')) return d
          if (d === '0' && key !== '.') return key
          return d + key
        })
      }
      return
    }

    if (key === 'AC') { setDisplay('0'); setPrev(null); setOperator(null); setWaitNext(false); return }

    if (key === '+/-') { setDisplay(d => String(parseFloat(d) * -1)); return }
    if (key === '%')   { setDisplay(d => String(parseFloat(d) / 100)); return }

    const ops = { '÷': '/', '×': '*', '−': '-', '+': '+' }
    if (ops[key]) {
      if (operator && !waitNext) {
        const result = compute(parseFloat(prev), parseFloat(display), operator)
        setDisplay(String(result)); setPrev(String(result))
      } else {
        setPrev(display)
      }
      setOperator(ops[key])
      setWaitNext(true)
      return
    }

    if (key === '=') {
      if (!operator || !prev) return
      const result = compute(parseFloat(prev), parseFloat(display), operator)
      const expr = `${prev} ${key === '÷'?'/':operator} ${display} = ${result}`
      setHistory(h => [expr, ...h].slice(0, 8))
      setDisplay(String(result)); setPrev(null); setOperator(null); setWaitNext(true)
    }
  }, [display, prev, operator, waitNext])

  function compute(a, b, op) {
    switch (op) {
      case '+': return +(a + b).toPrecision(12).replace(/\.?0+$/, '')
      case '-': return +(a - b).toPrecision(12).replace(/\.?0+$/, '')
      case '*': return +(a * b).toPrecision(12).replace(/\.?0+$/, '')
      case '/': return b === 0 ? 'Error' : +(a / b).toPrecision(12).replace(/\.?0+$/, '')
      default:  return b
    }
  }

  const displayLen = display.length
  const fontSize = displayLen > 14 ? '1.4rem' : displayLen > 9 ? '2rem' : displayLen > 6 ? '2.6rem' : '3.2rem'

  const btnClass = (k) => {
    if (k === '0') return 'calc-btn span2'
    if (['÷','×','−','+','='].includes(k)) return 'calc-btn op'
    if (['AC','+/-','%'].includes(k)) return 'calc-btn func'
    return 'calc-btn'
  }

  return (
    <div className="calc-page">
      <div className="page-nav">
        <div className="page-nav-inner">
          <div className="page-nav-logo">SGV<span className="accent">.</span>dev — Calculator</div>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>

      <div className="calc-layout">
        <div className="calc-wrap">
          <div className="calc-shell">
            {/* Display */}
            <div className="calc-display">
              <div className="calc-expr">{prev ? `${prev} ${operator || ''}` : ''}</div>
              <div className="calc-val" style={{ fontSize }}>{display}</div>
            </div>
            {/* Buttons */}
            <div className="calc-grid">
              {BUTTONS.flat().map((k, i) => (
                <button key={`${k}-${i}`} className={btnClass(k)} onClick={() => handleKey(k)}>
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="calc-history">
              <div className="ch-header">
                <span>History</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setHistory([])}>Clear</button>
              </div>
              {history.map((h, i) => (
                <div key={i} className="ch-item">{h}</div>
              ))}
            </div>
          )}
        </div>

        <div className="calc-info">
          <h2>Calculator</h2>
          <p>A fully functional calculator built with React. Supports basic arithmetic, percentage, sign toggle, and maintains a history of recent calculations.</p>
          <div className="calc-shortcuts">
            <h4>Keyboard Support</h4>
            <div className="cs-list">
              {[['0-9', 'Digit'], ['.', 'Decimal'], ['+−×÷', 'Operators'], ['Enter', 'Equals'], ['Escape', 'Clear'], ['Backspace', 'Delete']].map(([k, v]) => (
                <div key={k} className="cs-item">
                  <kbd>{k}</kbd><span>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: 16 }}>← Back to Showcase</Link>
        </div>
      </div>
    </div>
  )
}
