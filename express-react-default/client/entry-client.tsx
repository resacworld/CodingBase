import { lazy, StrictMode, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Page } from './Page.tsx'

const SpaPage = lazy(() => import('./pages/SpaPage.tsx').then((m) => ({ default: m.SpaPage })))

const root = document.getElementById('root')!
 
/*
  Server sent state -> SSR page, hydrate it. No state -> SPA shell, render from scratch.
 */
if (window.__STATE__) {
  hydrateRoot(root, <StrictMode><Page state={window.__STATE__} /></StrictMode>)
} else {
  createRoot(root).render(<StrictMode><Suspense fallback={<p>Chargement…</p>}><SpaPage /></Suspense></StrictMode>)
}
