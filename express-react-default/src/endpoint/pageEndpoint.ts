import { Router } from 'express'
import { renderPage } from '../render.ts'
import { todoService } from '../services/todoService.ts'

// HTML pages. SSR = data fetched + rendered on the server. SPA = empty shell, the browser does everything.
export const pageEndpoint = Router()

pageEndpoint.get('/', (_req, res) => {
  res.type('html').send('<a href="/ssr">SSR</a> | <a href="/spa">SPA</a>')
})

pageEndpoint.get('/ssr', async (req, res, next) => {
  // SSR calls the service directly, no HTTP round-trip.
  await renderPage(req, res, next, { page: 'ssr', todos: await todoService.list() })
})

// Catch-all so client-side sub-routes (/spa/whatever) survive a refresh.
pageEndpoint.get('/spa{/*splat}', async (req, res, next) => {
  await renderPage(req, res, next)
})
