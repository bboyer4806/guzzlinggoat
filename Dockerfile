# Build: install everything and build the app. No secrets are needed here.
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
# Dependencies don't need install scripts: esbuild and Rolldown install their binaries as regular
# packages. Skipping them also keeps dependency code out of the build step.
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build && npm prune --omit=dev

# Run: production dependencies, the built app and app.json (Dokku reads its health check from
# there).
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY app.json ./
USER node
EXPOSE 3000
CMD ["node", "build"]
