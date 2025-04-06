ARG NODE_VERSION
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma  
COPY tsconfig.json ./
COPY types ./types
COPY src ./src
COPY src/docs ./dist/docs

RUN npm ci

RUN npx prisma generate
RUN npm run build

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/app.js"]
