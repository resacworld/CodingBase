import type { Todo } from '../models/todo.ts'

// ponytail: in-memory store, lost on restart; swap for a DB when it matters.
const todos: Todo[] = [{ id: 1, title: 'Tester le SSR' }]

export const todoRepository = {
  findAll: async (): Promise<Todo[]> => todos,
  create: async (title: string): Promise<Todo> => {
    const todo = { id: todos.length + 1, title }
    todos.push(todo)
    return todo
  },
}
