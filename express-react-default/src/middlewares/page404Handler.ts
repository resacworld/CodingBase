import type { RequestHandler } from "express"
import { renderPage } from "../render.ts"
import { todoService } from "../services/todoService.ts"

export const Page404Handler: RequestHandler = async (req, res, next) => {
  await renderPage(req, res, next, { page: '404', todos: await todoService.list() }, 404)
}