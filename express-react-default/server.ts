process.loadEnvFile() // Load environment variables from .env file

import express from 'express'
import { errorHandler } from './src/middlewares/errorHandler.ts'
import { Page404Handler } from './src/middlewares/page404Handler.ts'
import { todoEndpoint } from './src/endpoint/todoEndpoint.ts'
import { pageEndpoint } from './src/endpoint/pageEndpoint.ts'
import { setupFrontend } from './src/render.ts'

const port = Number(process.env.PORT)

const app = express()
app.use(express.json())

app.use('/api/todos', todoEndpoint)
await setupFrontend(app) // before pages: serves /client/*, /@vite/* in dev and assets in prod
app.use(pageEndpoint)

app.use(errorHandler)
app.use(Page404Handler)

app.listen(port, () => console.log(`http://localhost:${port}`))
