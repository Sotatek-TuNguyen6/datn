FROM node:20.5-alpine
WORKDIR /app

COPY src src
COPY logs logs
COPY index.js  package.json ./
COPY .env ./

RUN npm install
EXPOSE 5010

CMD [ "npm", "start" ]
