import { router } from './trpc.ts'
import { todoEndpoint } from './todoEndpoint.ts'

// tRPC API served on /trpc. Add a feature = add its router here.
export const appRouter = router({
  todo: todoEndpoint,
})

// Single source of truth: client/api.ts infers every type from this.
export type AppRouter = typeof appRouter
