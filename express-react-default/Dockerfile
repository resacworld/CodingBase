# --- build: full deps, Prisma client + Vite bundles
FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npx prisma generate && npm run build

# --- runtime: prod deps only
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000 DATABASE_URL=file:/data/app.db
# Prisma's migration engine needs openssl, missing from slim images.
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY server.ts prisma.config.ts ./
COPY prisma ./prisma
# Fetch the migration engine now (as root): `migrate deploy` would try to download it at boot otherwise.
RUN npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > /dev/null

# SQLite file lives in a volume so it survives redeploys.
RUN mkdir /data && chown node:node /data
VOLUME /data
USER node
EXPOSE 3000

# Apply pending migrations, then start.
CMD ["sh", "-c", "npx prisma migrate deploy && node server.ts"]
