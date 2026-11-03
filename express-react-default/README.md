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

## Docker / CD

`Dockerfile` : build multi-stage, au démarrage `prisma migrate deploy` puis `node server.ts`. La base SQLite est dans le volume `/data`.

```
docker build -t express-react-default .
docker run -p 3000:3000 -v app-data:/data express-react-default
```

Le workflow `.github/workflows/express-react-default.yml` (à la racine du repo) construit l'image et la publie sur `ghcr.io/<owner>/express-react-default` (tags `latest` et `sha-xxxx`) à chaque push sur `main` qui touche ce dossier, puis déclenche le redéploiement sur Coolify.

Setup Coolify (une fois) :
1. Nouvelle ressource **Docker Image** : `ghcr.io/<owner>/express-react-default:latest`, port `3000`.
2. Image GHCR privée : ajouter les identifiants du registre sur le serveur (`docker login ghcr.io` avec un PAT `read:packages`), ou rendre le package public.
3. **Persistent Storage** : monter un volume sur `/data` (sinon la base SQLite est perdue à chaque déploiement).
4. Secrets GitHub du repo : `COOLIFY_WEBHOOK` (URL du Deploy Webhook de la ressource) et `COOLIFY_TOKEN` (API token avec la permission deploy).

## Lint / CI

`npm run lint` (oxlint ; typescript-eslint ne supporte pas TypeScript 7). Config : `.oxlintrc.json`.

CI : le job `lint` du workflow tourne après chaque push sur `main` et sur chaque PR ; le build Docker et le déploiement Coolify ne partent que s'il passe.
