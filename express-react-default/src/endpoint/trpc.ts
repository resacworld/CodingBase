import { initTRPC } from '@trpc/server'

// Own file so routers can import it without a cycle through appRouter.
const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure
