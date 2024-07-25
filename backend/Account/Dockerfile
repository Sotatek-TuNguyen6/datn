FROM node:20.5-alpine
WORKDIR /app

COPY src src
COPY logs logs
COPY index.js package.json ./
COPY .env ./
# Cài đặt các dependencies
RUN npm install

# Cài đặt nodemon toàn cục
RUN npm install -g nodemon

EXPOSE 5000

# Lệnh để chạy ứng dụng
CMD ["nodemon", "index.js"]
