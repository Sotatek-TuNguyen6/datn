# Sử dụng hình ảnh Python 3.9
FROM python:3.9-slim

# Đặt thư mục làm việc
WORKDIR /app

# Cài đặt các công cụ xây dựng cần thiết
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Sao chép các tệp requirements.txt và cài đặt các thư viện cần thiết
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép tất cả các tệp vào thư mục làm việc
COPY . .

# Chạy ứng dụng Flask
CMD ["python", "app.py"]
