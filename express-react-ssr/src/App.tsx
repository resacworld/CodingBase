import { useState, type SyntheticEvent } from 'react'
import { api } from './api.ts'
import type { AppState } from '../server/router.ts'

export function App({ initialTodos }: { initialTodos: AppState['todos'] }) {
  const [todos, setTodos] = useState(initialTodos)
  const [title, setTitle] = useState('')

  async function add(e: SyntheticEvent) {
    e.preventDefault()
    const todo = await api.todoAdd.mutate({ title })
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
