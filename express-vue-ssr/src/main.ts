import { createSSRApp } from 'vue'
import App from './App.vue'
import type { AppState } from '../server/router.ts'

// Fresh app per request on the server, once on the client.
export function createApp(state: AppState) {
  return createSSRApp(App, { initialTodos: state.todos })
}
