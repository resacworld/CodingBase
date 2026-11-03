import { HttpError } from '../middlewares/errorHandler.ts'
import { todoRepository } from '../repositories/todoRepository.ts'

// Business rules live here; endpoints stay thin, repositories stay dumb.
export const todoService = {
  list: () => todoRepository.findAll(),
  add: (title: unknown) => {
    if (typeof title !== 'string' || !title.trim()) throw new HttpError(400, 'title is required')
    return todoRepository.create(title.trim())
  },
}
