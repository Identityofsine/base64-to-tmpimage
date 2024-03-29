#NODE JS runtime
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*



# Set up Chrome's executable path
ENV CHROME_BIN /usr/bin/google-chrome

# give user node execute permissions for chrome
RUN npm install -g nodemon
RUN npm install -g typescript
RUN npm install -g forever 

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 5050

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser node_modules \
    && chown -R pptruser:pptruser package.json \
    && chown -R pptruser:pptruser package-lock.json \
    && chown -R pptruser:pptruser /usr/bin/google-chrome




# Start the application
CMD ["npm", "run", "dev"]
