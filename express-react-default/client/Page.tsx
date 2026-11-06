import { lazy, Suspense } from 'react'
import type { Todo } from '../src/types/todo.ts'

// Lazy: each page is its own chunk, the browser only downloads the one it renders.
const SsrPage = lazy(() => import('./pages/SsrPage.tsx').then((m) => ({ default: m.SsrPage })))
const Ssr404Page = lazy(() => import('./pages/Ssr404Page.tsx').then((m) => ({ default: m.Ssr404Page })))

/*
 Data rendered by the server and handed to the client for hydration. Add a page = add a variant.
 */
export type AppState = { page: 'ssr' | '404'; todos: Todo[] }

/**
 * Function to select the active page to be rendered with ssr (lazy load the selected page)
 * 
 * @param param0 AppState.page to select the page to render
 * @returns TSX component
 */
export function Page({ state }: { state: AppState }) {
  return <Suspense fallback={null}><SsrPageSelect state={state} /></Suspense>
}

/**
 * Function to select the active page to be rendered with ssr
 * 
 * @param param0 Appstate.page to select the page to render
 * @returns TSX component
 */
function SsrPageSelect({ state }: { state: AppState }) {
  switch (state.page) {
    case 'ssr':
      return <SsrPage todos={state.todos} />
    case '404':
      return <Ssr404Page />
  }
}
