import { renderToString } from 'vue/server-renderer'
import { createApp } from './main.ts'
import type { AppState } from '../server/router.ts'

export function render(state: AppState) {
  return renderToString(createApp(state))
}
