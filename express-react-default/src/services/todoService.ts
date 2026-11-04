import type { TodoCreateInput } from '../models/todo.ts'
import { todoRepository } from '../repositories/todoRepository.ts'

/* 
 Theses files purpose (in this folder) is to manage the buisness rules
*/

export const todoService = {
  list: () => todoRepository.findAll(),
  add: (input: TodoCreateInput) => todoRepository.create(input.title),
}
