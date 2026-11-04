import { StrictMode } from 'react'
import { renderToPipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { Page, type AppState } from './Page.tsx'

export function render(state: AppState, options: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <Page state={state} />
    </StrictMode>,
    options,
  )
}
