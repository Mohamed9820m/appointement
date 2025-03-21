FROM ghcr.io/puppeteer/puppeteer:24.4.0

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Google Chrome Stable and necessary dependencies
RUN apt-get update && apt-get install -y curl gnupg \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y --no-install-recommends google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json before installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app into the container
COPY . .

# Start the application
CMD ["node", "index.js"]
