FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install -g pnpm && pnpm install --prefix .

COPY . .

RUN npm run build

EXPOSE 5176

CMD ["npm", "run", "dev"]

