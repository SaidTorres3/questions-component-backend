# syntax=docker/dockerfile:1
FROM node:12-alpine
WORKDIR /questions-screen-backend
COPY . .
RUN npm install
CMD ["npm", "start"]