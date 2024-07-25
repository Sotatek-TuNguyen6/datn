FROM node:20.5-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json trước để cài đặt dependencies (nếu có package-lock.json)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép mã nguồn và các tệp khác vào container
COPY src src
COPY logs logs
COPY index.js ./
COPY .env ./
# Mở cổng ứng dụng
EXPOSE 5007

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
