import fs from 'node:fs/promises'
import express from 'express'
import type { ViteDevServer } from 'vite'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter, type AppState } from './server/router.ts'

type Render = typeof import('./src/entry-server.ts').render

const isProd = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT) || 3000

// SSR calls procedures directly, no HTTP round-trip.
const caller = appRouter.createCaller({})

const app = express()
app.use('/trpc', createExpressMiddleware({ router: appRouter }))

let vite: ViteDevServer | undefined
let prodTemplate = ''
let prodRender: Render | undefined

if (isProd) {
  prodTemplate = await fs.readFile('dist/client/index.html', 'utf-8')
  const entry = './dist/server/entry-server.js'
  prodRender = (await import(entry)).render
  app.use(express.static('dist/client', { index: false }))
} else {
  const { createServer } = await import('vite')
  vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  app.use(vite.middlewares)
}

app.use(async (req, res, next) => {
  try {
    let template = prodTemplate
    let render = prodRender!
    if (vite) {
      template = await vite.transformIndexHtml(req.originalUrl, await fs.readFile('index.html', 'utf-8'))
      render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
    }
    const state: AppState = { todos: await caller.todoList() }
    // Escape "<" so user data can't close the <script> tag (XSS).
    const stateScript = `<script>window.__STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')}</script>`
    const html = template
      .replace('<!--app-html-->', await render(state))
      .replace('<!--app-state-->', stateScript)
    res.type('html').send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e as Error)
    next(e)
  }
})

app.listen(port, () => console.log(`http://localhost:${port}`))
