import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Page } from './Page.tsx'
import { SpaPage } from './pages/SpaPage.tsx'

const root = document.getElementById('root')!
 
/*
  Server sent state -> SSR page, hydrate it. No state -> SPA shell, render from scratch.
 */
if (window.__STATE__) {
  hydrateRoot(root, <StrictMode><Page state={window.__STATE__} /></StrictMode>)
} else {
  createRoot(root).render(<StrictMode><SpaPage /></StrictMode>)
}
