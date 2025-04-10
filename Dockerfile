# Nest.js Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm add bcrypt express

COPY . .

RUN pnpm run build

CMD ["node", "dist/main.js"]
