FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN npm i --legacy-peer-deps

COPY tsconfig.json tsconfig.json
COPY public public
COPY codegen.yml codegen.yml
COPY src src
COPY tailwind.config.js tailwind.config.js
COPY postcss.config.js postcss.config.js
COPY .env .env

EXPOSE 3000

CMD npm start