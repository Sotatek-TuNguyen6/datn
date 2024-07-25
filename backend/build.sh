#!/bin/bash

# Danh sách các dịch vụ cần build và push
services=("Account" "Notification" "Chat" "Order" "Payment" "Product" "Review" "Actions" "Recommender" "Voucher" "Shipping" "ApiGateWay")

# Docker Hub username
username="ntu11022002"

# Phiên bản tag của image
version="latest"

# Lặp qua danh sách dịch vụ và thực hiện build và push
for service in "${services[@]}"
do
  echo "Building $service..."
  docker build -t $username/$service:$version ./$service
  
  if [ $? -eq 0 ]; then
    echo "Successfully built $service. Pushing to Docker Hub..."
    docker push $username/$service:$version
    
    if [ $? -eq 0 ]; then
      echo "Successfully pushed $service."
    else
      echo "Failed to push $service."
    fi
  else
    echo "Failed to build $service."
  fi

  echo "-------------------------------------------"
done
