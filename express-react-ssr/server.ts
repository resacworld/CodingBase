import fs from 'node:fs/promises'
import { Writable } from 'node:stream'
import express from 'express'
import type { ViteDevServer } from 'vite'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter, type AppState } from './server/router.ts'

type Render = typeof import('./src/entry-server.tsx').render

const isProd = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT) || 3001
const ABORT_DELAY = 10_000

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
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    }
    const state: AppState = { todos: await caller.todoList() }
    // Escape "<" so user data can't close the <script> tag (XSS).
    const stateScript = `<script>window.__STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')}</script>`
    const [head, tail] = template.replace('<!--app-state-->', stateScript).split('<!--app-html-->')

    // Send the head as soon as the shell is ready, then stream React's HTML, then the tail.
    const { pipe, abort } = render(state, {
      onShellReady() {
        res.status(200).type('html').write(head)
        pipe(
          new Writable({
            write(chunk, _encoding, callback) {
              res.write(chunk, callback)
            },
            final(callback) {
              res.end(tail)
              callback()
            },
          }),
        )
      },
      onShellError(error) {
        vite?.ssrFixStacktrace(error as Error)
        next(error)
      },
      onError(error) {
        console.error(error)
      },
    })
    setTimeout(abort, ABORT_DELAY)
  } catch (e) {
    vite?.ssrFixStacktrace(e as Error)
    next(e)
  }
})

app.listen(port, () => console.log(`http://localhost:${port}`))
