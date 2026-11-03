import express from 'express'
import { defineConfig, env } from 'prisma/config'

process.loadEnvFile() // prisma CLI doesn't read .env itself

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { 
    path: 'prisma/migrations', 
    seed: 'node --env-file-if-exists=.env prisma/seed.ts' 
  },
  datasource: { 
    url: env('DATABASE_URL') 
  },
})
