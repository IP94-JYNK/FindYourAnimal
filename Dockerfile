FROM node:14.15.3

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY  . /app/
