FROM node:20.5-alpine
WORKDIR /app

COPY src src
COPY logs logs
COPY index.js package.json ./
COPY .env ./

# COPY exemple.env ./.env
RUN npm install 
EXPOSE 5009

CMD [ "npm", "start" ]
