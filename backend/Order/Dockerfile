FROM node:20.5-alpine
WORKDIR /app
# Set npm registry and increase timeout
RUN npm config set registry https://registry.npmjs.org/ \
  && npm config set fetch-retry-mintimeout 600000 \
  && npm config set fetch-retry-maxtimeout 1200000 \
  && npm config set fetch-timeout 1800000 \
  && npm cache clean --force
COPY src src
COPY logs logs
COPY index.js package.json ./
# COPY exemple.env ./.env
RUN npm install
EXPOSE 5004

CMD [ "npm", "start" ]
