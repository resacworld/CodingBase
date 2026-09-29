import { renderToString } from 'vue/server-renderer'
import { createApp } from './main.ts'
import type { AppState } from '../shared/types.ts'

export function render(state: AppState) {
  return renderToString(createApp(state))
}
