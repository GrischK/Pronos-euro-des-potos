FROM node:lts-alpine

RUN apk --no-cache add curl
RUN apk add make g++ python3 git
RUN npm i -g node-pre-gyp

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN npm i --legacy-peer-deps

COPY src src
COPY tsconfig.json tsconfig.json
COPY .env .env

EXPOSE 4000

CMD npm start