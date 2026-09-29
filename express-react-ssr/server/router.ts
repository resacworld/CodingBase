import { initTRPC, type inferRouterOutputs } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

// ponytail: in-memory store, lost on restart; swap for a DB when it matters.
const todos = [{ id: 1, title: 'Tester le SSR' }]

// Single source of truth: the client's types are inferred from this router.
export const appRouter = t.router({
  todoList: t.procedure.query(() => todos),
  todoAdd: t.procedure
    .input(z.object({ title: z.string().trim().min(1) }))
    .mutation(({ input }) => {
      const todo = { id: todos.length + 1, title: input.title }
      todos.push(todo)
      return todo
    }),
})

export type AppRouter = typeof appRouter

// Data rendered by the server and handed to the client for hydration.
export interface AppState {
  todos: inferRouterOutputs<AppRouter>['todoList']
}
