# express-react-default

Base Express 5 + React 19 + Vite, avec une page SSR et une page SPA.

```
server.ts                 Lance le serveur selon la config 
src/                      ====> BACKEND
  models/                 ==> Types métier (schémas BDD, DTO)
  repositories/           ==> Accès aux données (via BDD ou autre)
    db.ts                 -> Client Prisma partagé
  generated/prisma/       -> Client Prisma généré (gitignoré, `prisma generate`)
  services/               ==> Définit les règles métier
  endpoint/               ==> Définit les routes 
    todoEndpoint.ts       -> API JSON  -> /api/todos
    pageEndpoint.ts       -> Pages HTML -> /ssr, /spa/*
  middlewares/            ==> Définis/créer les middlewares backend
  render.ts               -> Vite (dev) / dist (prod) + rendu SSR streamé
client/                   ====> FRONTEND
  entry-server.tsx        -> AppState + rendu serveur
  entry-client.tsx        -> Hydrate si window.__STATE__, sinon rend la SPA
  api.ts                  -> Fetch typé vers /api
  pages/                  ==> Composants de page
index.html                ====> Template (<!--app-state--> / <!--app-html-->)
prisma/                   ====> BDD : schema.prisma, migrations/, seed.ts
prisma.config.ts          -> Config CLI Prisma (DATABASE_URL)
```

## Base de données

SQLite (`dev.db`) via Prisma 7 + adapter libsql. Modifier `prisma/schema.prisma` puis :

```
npm run db:migrate    # crée la migration + regénère le client
npm run db:seed       # données initiales
npm run db:studio     # UI d'admin
npm run db:deploy     # en prod : applique les migrations
```

Passer à Postgres : `provider = "postgresql"` dans le schéma, `@prisma/adapter-pg` dans `src/repositories/db.ts`, et une `DATABASE_URL` postgres.

- **SSR** (`/ssr`) : le serveur appelle le service, rend React, envoie le state ; le client hydrate.
- **SPA** (`/spa/*`) : le serveur envoie le shell vide ; le client fetch `/api/todos`.

Ajouter une page SSR : une variante dans `AppState` + un `case` dans `Page` + une route dans `pageEndpoint.ts`.

```
npm run dev         # http://localhost:3000
npm run build && npm run start_prod
```
