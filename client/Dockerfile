# Frontend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
WORKDIR /app/client
EXPOSE 3000
CMD ["npm", "run", "dev"] 