FROM node:slim

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN npm install
RUN npm ci --only=production

EXPOSE 8080

CMD [ "node", "server.js" ]