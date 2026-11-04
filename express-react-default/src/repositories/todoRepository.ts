import type { Todo } from '../models/todo.ts'
import { db } from './db.ts'

/*
 Theses files purpose (in this folder) is to manage the BDD read / write 
 It doesn't manage the security (not his job)
*/

export const todoRepository = {
  findAll: (): Promise<Todo[]> => db.todo.findMany({ orderBy: { id: 'asc' } }),
  create: (title: string): Promise<Todo> => db.todo.create({ data: { title } }),
}
