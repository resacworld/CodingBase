import { useState, type SyntheticEvent } from 'react'
import { api } from '../api.ts'
import type { Todo } from '../../src/types/todo.ts'

// Shared by both pages: only how the initial data arrives differs.
export function TodoList({ todos, setTodos }: { todos: Todo[]; setTodos: (fn: (prev: Todo[]) => Todo[]) => void }) {
  const [title, setTitle] = useState('')

  async function add(e: SyntheticEvent) {
    e.preventDefault()
    const todo = await api.todo.add.mutate({ title })
    setTodos((prev) => [...prev, todo])
    setTitle('')
  }

  return (
    <>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <form onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <button>Ajouter</button>
      </form>
      <a href="/ssr">SSR</a> | <a href="/spa">SPA</a>
    </>
  )
}
