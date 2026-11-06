import { todoCreateInput } from '../types/todo.ts'
import { todoService } from '../services/todoService.ts'
import { publicProcedure, trpcRouter } from './trpc.ts'

// Todo endpoint
export const todoEndpoint = trpcRouter({
  list: publicProcedure.query(() => todoService.list()),
  add: publicProcedure.input(todoCreateInput).mutation(({ input }) => todoService.add(input)),
})
