import fs from 'node:fs/promises'
import { Writable } from 'node:stream'
import express, { type Express, type NextFunction, type Request, type Response } from 'express'
import type { ViteDevServer } from 'vite'
import type { AppState } from '../client/entry-server.tsx'
import { isProd } from './env.ts'

type Render = typeof import('../client/entry-server.tsx').render

const ABORT_DELAY = 10_000

let vite: ViteDevServer | undefined
let prodTemplate = ''
let prodRender: Render | undefined

// Dev: Vite middleware (HMR, on-the-fly TSX). Prod: static files from `npm run build`.
export async function setupFrontend(app: Express) {
  if (isProd) {
    prodTemplate = await fs.readFile('dist/client/index.html', 'utf-8')
    const entry = '../dist/server/entry-server.js'
    prodRender = (await import(entry)).render
    app.use(express.static('dist/client', { index: false }))
  } else {
    const { createServer } = await import('vite')
    vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
    app.use(vite.middlewares)
  }
}

// No state = SPA shell (empty #root). With state = React rendered server-side and streamed.
export async function renderPage(req: Request, res: Response, next: NextFunction, state?: AppState) {
  try {
    let template = prodTemplate
    let render = prodRender!
    if (vite) {
      template = await vite.transformIndexHtml(req.originalUrl, await fs.readFile('index.html', 'utf-8'))
      render = (await vite.ssrLoadModule('/client/entry-server.tsx')).render
    }

    // CSP: tag every script of the template (ours + Vite's) with this request's nonce.
    const nonce: string = res.locals.nonce
    template = template.replace(/<script/g, `<script nonce="${nonce}"`)

    if (!state) return res.type('html').send(template.replace('<!--app-state-->', '').replace('<!--app-html-->', ''))

    // Escape "<" so user data can't close the <script> tag (XSS).
    const stateScript = `<script nonce="${nonce}">window.__STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')}</script>`
    const [head, tail] = template.replace('<!--app-state-->', stateScript).split('<!--app-html-->')

    // Send the head as soon as the shell is ready, then stream React's HTML, then the tail.
    const { pipe, abort } = render(state, {
      nonce, // React's own inline streaming scripts (Suspense) need it too
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
}
