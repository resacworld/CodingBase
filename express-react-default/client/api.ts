import { createTRPCClient, httpBatchLink } from '@trpc/client'
// `import type` only: no server code ends up in the client bundle.
import type { AppRouter } from '../src/endpoint/appRouter.ts'

export const api = createTRPCClient<AppRouter>({ links: [httpBatchLink({ url: '/trpc' })] })
