import { z } from 'zod'

// Generated from prisma/schema.prisma. `browser.ts` = types only, safe to import from client/.
export type { Todo } from '../generated/prisma/browser.ts'

// DTO: what the API accepts to create a todo (validated by tRPC before reaching the service).
export const todoCreateInput = z.object({ title: z.string().trim().min(1).max(200) })
export type TodoCreateInput = z.infer<typeof todoCreateInput>
