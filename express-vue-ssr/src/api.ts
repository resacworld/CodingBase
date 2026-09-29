import { createTRPCClient, httpBatchLink } from '@trpc/client'
// `import type` only: no server code ends up in the client bundle.
import type { AppRouter } from '../server/router.ts'

export const api = createTRPCClient<AppRouter>({ links: [httpBatchLink({ url: '/trpc' })] })
