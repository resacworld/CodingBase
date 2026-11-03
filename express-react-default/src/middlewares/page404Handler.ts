import type { RequestHandler } from "express"

export const Page404Handler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Page Not Found' })
}