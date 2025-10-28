FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

FROM node:20-slim

WORKDIR /usr/src/app

USER node

COPY --from=build /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/package.json ./package.json

COPY --from=build /usr/src/app/server.js ./server.js

COPY --from=build /usr/src/app/config ./config

COPY --from=build /usr/src/app/controllers ./controllers

COPY --from=build /usr/src/app/middleware ./middleware

COPY --from=build /usr/src/app/routes ./routes

COPY --from=build /usr/src/app/services ./services

EXPOSE 8080

CMD [ "node", "server.js" ]