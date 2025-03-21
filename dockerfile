# Use the official Puppeteer image
FROM ghcr.io/puppeteer/puppeteer:24.4.0

# Ensure we run as root to avoid permission issues
USER root

# Set environment variables to avoid Chromium issues
ENV XDG_CONFIG_HOME=/tmp/.chromium
ENV XDG_CACHE_HOME=/tmp/.chromium

# Install required browsers (fixing post-install script issues)
RUN npx puppeteer browsers install

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["node", "index.js"]
