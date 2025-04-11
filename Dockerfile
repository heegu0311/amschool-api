# Nest.js Dockerfile
FROM node:20 AS base
WORKDIR /usr/src/app
RUN npm install -g npm@latest

# Development stage
FROM base AS development
COPY package*.json ./
RUN npm install
EXPOSE 8000
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["node", "dist/main.js"]