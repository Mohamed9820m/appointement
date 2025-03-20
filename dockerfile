FROM ghcr.io/puppeteer/puppeteer:24.4.0

# Install Google Chrome (and any dependencies required by Puppeteer)
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fontconfig \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libavformat58 \
    libbz2-1.0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    google-chrome-stable

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json /usr/src/app/

# Install dependencies
RUN npm ci

# Copy the rest of the app into the container
COPY . /usr/src/app/

# Start the application
CMD ["node", "index.js"]
