# Use the official Python image as a base image
FROM python:3.9-slim

# Install wget and other necessary tools
RUN apt-get update && \
    apt-get install -y wget gnupg procps && \
    apt-get clean

# Install AdoptOpenJDK
RUN wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | apt-key add - && \
    add-apt-repository --yes https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ && \
    apt-get update && \
    apt-get install -y adoptopenjdk-11-hotspot && \
    apt-get clean

# Set JAVA_HOME environment variable
ENV JAVA_HOME /usr/lib/jvm/adoptopenjdk-11-hotspot-amd64
ENV PATH $JAVA_HOME/bin:$PATH

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy the application code
COPY . .

# Command to run the application
CMD ["python", "app.py"]
