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
    trpc.ts               -> Init tRPC (router, publicProcedure)
    appRouter.ts          -> Router tRPC racine -> /trpc (type AppRouter)
    todoEndpoint.ts       -> Procédures todo.list / todo.add (validées par zod)
    pageEndpoint.ts       -> Pages HTML -> /ssr, /spa/*
  middlewares/            ==> Définis/créer les middlewares backend
  render.ts               -> Vite (dev) / dist (prod) + rendu SSR streamé
client/                   ====> FRONTEND
  entry-server.tsx        -> AppState + rendu serveur
  entry-client.tsx        -> Hydrate si window.__STATE__, sinon rend la SPA
  api.ts                  -> Client tRPC, types inférés depuis AppRouter
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
- **SPA** (`/spa/*`) : le serveur envoie le shell vide ; le client appelle `api.todo.list.query()` (tRPC).

Ajouter une route API : une procédure dans un router de `src/endpoint/`, branché dans `appRouter.ts`. Le front voit le nouveau type immédiatement, une erreur de signature casse le typecheck.

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

## Sécurité

- `src/env.ts` : variables d'env validées par zod au démarrage (crash immédiat si invalide). Utiliser `env.X`, jamais `process.env.X`.
- `src/middlewares/security.ts` :
  - `helmet` : CSP, HSTS (prod), nosniff, anti-iframe… La CSP n'autorise que les `<script>` portant le nonce de la requête, ajouté automatiquement par `render.ts`. Script inline ajouté à la main ailleurs = bloqué.
  - Rate limit sur `/trpc` : 100 req/min/IP (`trust proxy` activé pour l'IP réelle derrière Coolify).
- Entrées : validées par zod dans `src/models/` (penser à toujours mettre un `.max()` sur les chaînes).
- State SSR : `<` échappé dans `window.__STATE__` (anti-XSS).
- CI : `npm audit --omit=dev --audit-level=high` bloque le déploiement si une dépendance de prod a une faille connue.
