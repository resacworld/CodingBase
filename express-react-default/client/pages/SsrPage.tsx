import { useState } from 'react'
import type { Todo } from '../../src/types/todo.ts'
import { TodoList } from './TodoList.tsx'

// Data comes from the server (already in the HTML), no fetch on load.
export function SsrPage({ todos: initialTodos }: { todos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos)
  return (
    <>
      <h1>Todos (SSR)</h1>
      <TodoList todos={todos} setTodos={setTodos} />
    </>
  )
}
