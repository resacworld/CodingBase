import { StrictMode } from 'react'
import { renderToPipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import type { Todo } from '../src/models/todo.ts'
import { SsrPage } from './pages/SsrPage.tsx'
import { Ssr404Page } from './pages/Ssr404Page.tsx'

// Data rendered by the server and handed to the client for hydration. Add a page = add a variant.
export type AppState = { page: 'ssr' | '404'; todos: Todo[] }

export function Page({ state }: { state: AppState }) {
  switch (state.page) {
    case 'ssr':
      return <SsrPage todos={state.todos} />
    case '404' : 
      return <Ssr404Page />
  }
}

export function render(state: AppState, options: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <Page state={state} />
    </StrictMode>,
    options,
  )
}
