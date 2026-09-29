import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { App } from './App.tsx'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App initialTodos={window.__STATE__.todos} />
  </StrictMode>,
)
