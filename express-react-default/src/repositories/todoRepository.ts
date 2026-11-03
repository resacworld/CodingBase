import type { Todo } from '../models/todo.ts'
import { db } from './db.ts'

export const todoRepository = {
  findAll: (): Promise<Todo[]> => db.todo.findMany({ orderBy: { id: 'asc' } }),
  create: (title: string): Promise<Todo> => db.todo.create({ data: { title } }),
}
