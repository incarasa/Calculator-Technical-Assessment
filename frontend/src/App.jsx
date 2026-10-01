import { useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

const operatorSymbols = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
}

function App() {
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  function inputDigit(digit) {
    if (isLoading) return
    setError(null)

    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
      return
    }

    setDisplay(display === '0' ? digit : display + digit)
  }

  function inputDecimal() {
    if (isLoading) return
    setError(null)

    if (waitingForSecondOperand) {
      setDisplay('0.')
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes('.')) setDisplay(display + '.')
  }

  function chooseOperator(nextOperator) {
    if (isLoading) return
    setError(null)
    setFirstOperand(Number(display))
    setOperator(nextOperator)
    setWaitingForSecondOperand(true)
  }

  function clearCalculator() {
    setDisplay('0')
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
    setError(null)
    setIsLoading(false)
  }

  function deleteLastDigit() {
    if (isLoading || waitingForSecondOperand) return
    setError(null)
    setDisplay(display.length === 1 ? '0' : display.slice(0, -1))
  }

  async function calculate() {
    if (isLoading) return

    if (firstOperand === null || operator === null || waitingForSecondOperand) {
      setError('Complete the operation before pressing the equal sign!')
      return
    }

    const secondOperand = Number(display)
    const params = new URLSearchParams({
      a: firstOperand.toString(),
      b: secondOperand.toString(),
    })

    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/${operator}?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'The operation could not be completed')
      }

      setDisplay(String(data.result))
      setFirstOperand(null)
      setOperator(null)
      setWaitingForSecondOperand(true)
    } catch (requestError) {
      const message =
        requestError instanceof TypeError
          ? 'It was not possible to connect to the calculator. Check if the backend is running!'
          : requestError.message

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const operationLabel = operator
    ? `${firstOperand} ${operatorSymbols[operator]}`
    : ''

  return (
    <main className="app-shell">
      <section className="calculator" aria-label="Calculator">
        <div className="display-panel" aria-live="polite">
          <span className="operation">{operationLabel}</span>
          <output className="display">{isLoading ? '...' : display}</output>
        </div>

        <p className={`message ${error ? 'message--error' : ''}`} role="alert">
          {error}
        </p>

        <div className="keypad">
          <button className="key key--utility key--wide" onClick={clearCalculator}>AC</button>
          <button className="key key--utility" onClick={deleteLastDigit} aria-label="Delete last digit">⌫</button>
          <button className="key key--operator" onClick={() => chooseOperator('divide')}>÷</button>

          {[7, 8, 9].map((digit) => (
            <button className="key" key={digit} onClick={() => inputDigit(String(digit))}>{digit}</button>
          ))}
          <button className="key key--operator" onClick={() => chooseOperator('multiply')}>×</button>

          {[4, 5, 6].map((digit) => (
            <button className="key" key={digit} onClick={() => inputDigit(String(digit))}>{digit}</button>
          ))}
          <button className="key key--operator" onClick={() => chooseOperator('subtract')}>−</button>

          {[1, 2, 3].map((digit) => (
            <button className="key" key={digit} onClick={() => inputDigit(String(digit))}>{digit}</button>
          ))}
          <button className="key key--operator" onClick={() => chooseOperator('add')}>+</button>

          <button className="key key--zero" onClick={() => inputDigit('0')}>0</button>
          <button className="key" onClick={inputDecimal}>.</button>
          <button className="key key--equals" onClick={calculate} disabled={isLoading}>=</button>
        </div>
      </section>
    </main>
  )
}

export default App
