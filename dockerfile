FROM ghcr.io/puppeteer/puppeteer:24.4.0

# Install required dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
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
    && rm -rf /var/lib/apt/lists/*

# Manually set Puppeteer to use system Chrome instead of downloading its own
RUN npm config set puppeteer_skip_chromium_download true

# Set Puppeteer executable path
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome"

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the app into the container
COPY . .

# Expose necessary ports if required
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
