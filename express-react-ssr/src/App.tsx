import { useState, type SyntheticEvent } from 'react'
import type { NewTodo, Todo } from '../shared/types.ts'

export function App({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos)
  const [title, setTitle] = useState('')

  async function add(e: SyntheticEvent) {
    e.preventDefault()
    const body: NewTodo = { title }
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return
    const todo = (await res.json()) as Todo
    setTodos((prev) => [...prev, todo])
    setTitle('')
  }

  return (
    <>
      <h1>Todos (SSR)</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <form onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <button>Ajouter</button>
      </form>
    </>
  )
}
