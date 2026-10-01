import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('Calculator', () => {
  test('shows its initial state', () => {
    render(<App />)

    expect(screen.getByRole('region', { name: 'Calculator' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('0')
    expect(screen.getByRole('button', { name: 'AC' })).toBeInTheDocument()
  })

  test('builds the displayed number from digit input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '5' }))

    expect(screen.getByRole('status')).toHaveTextContent('125')
  })

  test('resets the calculator when AC is pressed', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '9' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: 'AC' }))

    expect(screen.getByRole('status')).toHaveTextContent('0')
    expect(screen.queryByText('9 +')).not.toBeInTheDocument()
  })

  test('sends an operation to the API and displays the result', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ result: 8 }),
    })
    vi.stubGlobal('fetch', fetchMock)
    render(<App />)

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/add?a=5&b=3',
    )
    expect(await screen.findByRole('status')).toHaveTextContent('8')
  })

  test('shows the backend message when the API returns an error', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          detail: 'Division by zero is not allowed',
        }),
      }),
    )
    render(<App />)

    await user.click(screen.getByRole('button', { name: '8' }))
    await user.click(screen.getByRole('button', { name: '÷' }))
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Division by zero is not allowed',
    )
  })

  test('shows a friendly message when the API cannot be reached', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    )
    render(<App />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'It was not possible to connect to the calculator',
    )
  })
})
