FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install -g @nestjs/cli
RUN npm install

# Build the app
COPY src/ ./src/
RUN npm run build
RUN npm prune --production

# Second stage
FROM node:20-alpine

# Create app directory and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir /app && chown appuser:appgroup /app
USER appuser
WORKDIR /app

# Copy built assets from build stage
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]