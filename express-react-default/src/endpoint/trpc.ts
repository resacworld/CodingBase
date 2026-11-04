import { initTRPC } from '@trpc/server'

// Own file so routers can import it without a cycle through appRouter.
const t = initTRPC.create()

// Trpc router and procedure, used in enpoints
export const trpcRouter = t.router
export const publicProcedure = t.procedure
