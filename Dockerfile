# Source 1: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# Source 2: https://itnext.io/dockerize-a-typescript-app-in-15-mins-a0e8c1e904b3
FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json
# are copied where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install

# Bundle app source
COPY . .

# Compile TypeScript to JavaScript
RUN npm run tsc

EXPOSE 52300
CMD [ "node", "server.js" ]
