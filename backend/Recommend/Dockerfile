# Sử dụng Python 3.9 làm image cơ bản
FROM python:3.9-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép yêu cầu vào thư mục làm việc
COPY requirements.txt .

# Cài đặt các gói yêu cầu
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ nội dung của dự án vào thư mục làm việc
COPY . .

# Mở cổng cho Flask
EXPOSE 5000

# Chạy ứng dụng
CMD ["python", "app.py"]
