FROM node:8.8-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /usr/src/myhome

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

