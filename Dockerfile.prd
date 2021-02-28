FROM node:14.16.0-alpine AS base

# Create '/app' folder and change owner to 'node'
RUN mkdir /app && chown -R node:node /app

# Set working directory 
WORKDIR /app

# Set user
USER node

# Copy files with 'node' as owner
COPY --chown=node:node package.json yarn.lock ./
# Install dependencies
RUN yarn install
# Copy files with 'node' as owner
COPY --chown=node:node . .
# Compile TypeScript
RUN yarn build
CMD ["node", "dist/index.js"]


FROM node:14.15.0-alpine AS prod
# Set 'NODE_ENV'
ENV NODE_ENV=production

# Expose port
EXPOSE 52300

# Create '/app' folder and change owner to 'node'
RUN mkdir /app && chown -R node:node /app

# Set working directory 
WORKDIR /app

# Set user
USER node
# Copy files from first step
COPY --from=base --chown=node:node /app/package.json /app/yarn.lock ./
# Install dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean
# Copy files from first step
COPY --from=base --chown=node:node /app/config ./config
# Copy files from first step
COPY --from=base --chown=node:node /app/dist ./dist

CMD ["node", "dist/index.js"]
