import { PrismaLibSql } from '@prisma/adapter-libsql'
import { env } from '../env.ts'
import { PrismaClient } from '../generated/prisma/client.ts'

/*
 Single shared client to avoid problems 
 To pass to postgres: swap for @prisma/adapter-pg + provider "postgresql" in the schema.
*/
export const db = new PrismaClient({ adapter: new PrismaLibSql({ url: env.DATABASE_URL }) })
