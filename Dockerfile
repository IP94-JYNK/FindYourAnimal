FROM node:14.15.3

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json /app/

RUN npm ci

COPY  . /app/
