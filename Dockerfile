#NODE JS runtime
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Update 
RUN apt-get update  

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

# Start the application
CMD ["npm", "run", "dev"]
