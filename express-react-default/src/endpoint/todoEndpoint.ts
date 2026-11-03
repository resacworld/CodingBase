import { Router } from 'express'
import { todoService } from '../services/todoService.ts'

// JSON API, used by the SPA (and anything else).
export const todoEndpoint = Router()

todoEndpoint.get('/', async (_req, res) => {
  res.json(await todoService.list())
})

todoEndpoint.post('/', async (req, res) => {
  res.status(201).json(await todoService.add(req.body?.title))
})
