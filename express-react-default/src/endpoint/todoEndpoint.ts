import { todoCreateInput } from '../models/todo.ts'
import { todoService } from '../services/todoService.ts'
import { publicProcedure, router } from './trpc.ts'

export const todoEndpoint = router({
  list: publicProcedure.query(() => todoService.list()),
  add: publicProcedure.input(todoCreateInput).mutation(({ input }) => todoService.add(input)),
})
