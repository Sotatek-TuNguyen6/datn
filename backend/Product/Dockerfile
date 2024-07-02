FROM node:20.5-alpine
WORKDIR /app

COPY src src
COPY logs logs
COPY index.js package.json ./
# COPY exemple.env ./.env

RUN npm install
EXPOSE 5001

CMD [ "npm", "start" ]
