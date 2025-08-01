# syntax=docker/dockerfile:1
FROM node:lts-alpine
WORKDIR /app
COPY package*.json /app/
RUN npm ci --only=production
COPY . /app/
RUN npx prisma generate
RUN npx tsc
EXPOSE 3001
CMD ["node", "dist/index.js"]
