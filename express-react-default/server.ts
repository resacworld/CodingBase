import express from 'express'
import { errorHandler } from './src/middlewares/errorHandler.ts'
import { Page404Handler } from './src/middlewares/page404Handler.ts'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './src/endpoint/appRouter.ts'
import { pageEndpoint } from './src/endpoint/pageEndpoint.ts'
import { setupFrontend } from './src/render.ts'

const port = Number(process.env.PORT)

const app = express()
app.use(express.json())

app.use('/trpc', createExpressMiddleware({ router: appRouter }))
await setupFrontend(app) // before pages: serves /client/*, /@vite/* in dev and assets in prod
app.use(pageEndpoint)

app.use(errorHandler)
app.use(Page404Handler)

app.listen(port, () => console.log(`http://localhost:${port}`))
