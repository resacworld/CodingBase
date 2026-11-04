import type { TodoCreateInput } from '../models/todo.ts'
import { todoRepository } from '../repositories/todoRepository.ts'

// Business rules live here; endpoints stay thin, repositories stay dumb.
// Input is already validated by the endpoint (zod), the service only gets clean data.
export const todoService = {
  list: () => todoRepository.findAll(),
  add: (input: TodoCreateInput) => todoRepository.create(input.title),
}
