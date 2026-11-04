import { StrictMode } from 'react'
import { renderToPipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { Page, type AppState } from './Page.tsx'

/**
 * Method to render ssr
 * 
 * @param state Appstate
 * @param options 
 * @returns 
 */
export function render(state: AppState, options: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <Page state={state} />
    </StrictMode>,
    options,
  )
}
