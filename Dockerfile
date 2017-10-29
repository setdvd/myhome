FROM node:8.8-alpine

WORKDIR /usr/src/myhome

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build:ts
RUN npm run webpack

EXPOSE 3000

