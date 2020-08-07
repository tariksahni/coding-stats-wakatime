FROM debian:9.5-slim

MAINTAINER Tarik "tariksahni@gmail.com"

COPY package.json .
COPY yarn.lock .

RUN apt-get update && apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash

RUN apt-get install -y nodejs

RUN npm install -g yarn
RUN yarn install
CMD yarn start

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]