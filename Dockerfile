FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx","kill-port","5000"]
CMD ["node","app.js"]
EXPOSE 5000