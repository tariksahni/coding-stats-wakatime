FROM debian:9.5-slim

MAINTAINER Tarik "tariksahni@gmail.com"

COPY package.json .
COPY yarn.lock .
RUN npm install -g yarn
RUN yarn install
CMD yarn start

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]