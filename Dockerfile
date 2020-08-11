FROM ubuntu:latest

MAINTAINER Tarik "tariksahni@gmail.com"

ADD . .

COPY package.json .

COPY yarn.lock .

RUN apt-get update && apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash

RUN apt-get install -y git nodejs

RUN npm install -g yarn

RUN yarn install

CMD yarn start