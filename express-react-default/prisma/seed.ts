import { db } from '../src/repositories/db.ts'

if ((await db.todo.count()) === 0) await db.todo.create({ data: { title: 'Tester le SSR' } })
await db.$disconnect()
