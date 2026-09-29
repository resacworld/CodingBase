import { StrictMode } from 'react'
import { renderToPipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { App } from './App.tsx'
import type { AppState } from '../server/router.ts'

export function render(state: AppState, options: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <App initialTodos={state.todos} />
    </StrictMode>,
    options,
  )
}
