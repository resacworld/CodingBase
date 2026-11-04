import { randomBytes } from 'node:crypto'
import type { RequestHandler, Response } from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { isProd } from '../env.ts'

// Fresh random nonce per request: only <script> tags carrying it may run (see render.ts).
export const nonce: RequestHandler = (_req, res, next) => {
  res.locals.nonce = randomBytes(16).toString('base64')
  next()
}

// Security headers (CSP, HSTS, nosniff, frame-ancestors, no X-Powered-By...).
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", (_req, res) => `'nonce-${(res as Response).locals.nonce}'`],
      // Dev only: Vite's HMR websocket runs on its own port; plain http on localhost, no https upgrade.
      connectSrc: isProd ? ["'self'"] : ["'self'", 'ws://localhost:*'],
      upgradeInsecureRequests: isProd ? [] : null,
    },
  },
  strictTransportSecurity: isProd,
})

export const apiRateLimit = rateLimit({
  windowMs: 60_000,
  limit: isProd ? 100 : 99999,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})
