import type { Todo } from '../src/models/todo.ts'
import { SsrPage } from './pages/SsrPage.tsx'
import { Ssr404Page } from './pages/Ssr404Page.tsx'


/*
 Data rendered by the server and handed to the client for hydration. Add a page = add a variant.
 
 */
export type AppState = { page: 'ssr' | '404'; todos: Todo[] }

/**
 * Function to select the active page to be rendered with ssr
 * 
 * @param param0 AppState.page to select the page to render
 * @returns TSX component
 */
export function Page({ state }: { state: AppState }) {
  switch (state.page) {
    case 'ssr':
      return <SsrPage todos={state.todos} />
    case '404':
      return <Ssr404Page />
  }
}
