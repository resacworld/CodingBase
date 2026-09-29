/// <reference types="vite/client" />

interface Window {
  __STATE__: import('../server/router.ts').AppState
}
