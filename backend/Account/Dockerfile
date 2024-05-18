FROM node:16-alpine
WORKDIR /app
COPY src src
COPY index.js package-lock.json package.json ./
# COPY exemple.env ./.env

RUN npm install
EXPOSE 5000

CMD [ "npm", "start" ]
