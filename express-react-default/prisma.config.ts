import express from 'express'
import { existsSync } from 'node:fs'
import { defineConfig, env } from 'prisma/config'

// prisma CLI doesn't read .env itself; in Docker there's no .env, vars come from the environment.
if (existsSync('.env')) process.loadEnvFile()

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
