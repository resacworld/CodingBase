import express from 'express'
import { env, isProd } from './src/env.ts'
import { errorHandler } from './src/middlewares/errorHandler.ts'
import { Page404Handler } from './src/middlewares/page404Handler.ts'
import { apiRateLimit, nonce, securityHeaders } from './src/middlewares/security.ts'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './src/endpoint/appRouter.ts'
import { pageEndpoint } from './src/endpoint/pageEndpoint.ts'
import { setupFrontend } from './src/render.ts'

const app = express()

// Behind Coolify's proxy: real client IP for the rate limit
app.set('trust proxy', 1) 

// Apply securities
app.use(nonce, securityHeaders)
app.use(express.json({ limit: '100kb' }))

// Initialize Trpc
app.use('/trpc', apiRateLimit, createExpressMiddleware({ router: appRouter }))
await setupFrontend(app) // before pages: serves /client/*, /@vite/* in dev and assets in prod

// Initialize routes
app.use(pageEndpoint)

// Manage issues
app.use(errorHandler)
app.use(Page404Handler)

// Listen on the port, the server is started ! 
app.listen(env.PORT, () => console.log(`http://${isProd ? '0.0.0.0' : 'localhost'}:${env.PORT}`))
