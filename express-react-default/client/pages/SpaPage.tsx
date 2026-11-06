import { useEffect, useState } from 'react'
import { api } from '../api.ts'
import type { Todo } from '../../src/types/todo.ts'
import { TodoList } from './TodoList.tsx'

// Empty HTML from the server; data fetched by the browser after load.
export function SpaPage() {
  const [todos, setTodos] = useState<Todo[] | null>(null)

  useEffect(() => {
    api.todo.list.query().then(setTodos)
  }, [])

  return (
    <>
      <h1>Todos (SPA)</h1>
      {todos ? <TodoList todos={todos} setTodos={(fn) => setTodos((prev) => fn(prev ?? []))} /> : <p>Chargement…</p>}
    </>
  )
}
