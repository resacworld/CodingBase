# express-react-default

Base Express 5 + React 19 + Vite, avec une page SSR et une page SPA.

```
server.ts                 Lance le serveur selon la config 
src/                      ====> BACKEND
  models/                 ==> Types métier (schémas BDD, DTO)
  repositories/           ==> Accès aux données (via BDD ou autre)
  services/               ==> Définit les règles métier
  endpoint/               ==> Définit les routes 
    todoEndpoint.ts       -> API JSON  -> /api/todos
    pageEndpoint.ts       -> pages HTML -> /ssr, /spa/*
  middlewares/            ==> ErrorHandler + HttpError
  render.ts               Vite (dev) / dist (prod) + rendu SSR streamé
client/                   ====> FRONTEND
  entry-server.tsx        AppState + rendu serveur
  entry-client.tsx        hydrate si window.__STATE__, sinon rend la SPA
  api.ts                  fetch typé vers /api
  pages/                  composants de page
index.html                template (<!--app-state--> / <!--app-html-->)
```

- **SSR** (`/ssr`) : le serveur appelle le service, rend React, envoie le state ; le client hydrate.
- **SPA** (`/spa/*`) : le serveur envoie le shell vide ; le client fetch `/api/todos`.

Ajouter une page SSR : une variante dans `AppState` + un `case` dans `Page` + une route dans `pageEndpoint.ts`.

```
npm run dev         # http://localhost:3000
npm run build && npm run start_prod
```
