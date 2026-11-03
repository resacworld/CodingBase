import type { Todo } from '../src/models/todo.ts'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init })
  if (!res.ok) throw new Error((await res.json()).error ?? res.statusText)
  return res.json()
}

export const api = {
  todoList: () => request<Todo[]>('/api/todos'),
  todoAdd: (title: string) => request<Todo>('/api/todos', { method: 'POST', body: JSON.stringify({ title }) }),
}
