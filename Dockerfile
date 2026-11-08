FROM node:24-alpine

RUN apk update
RUN apk add git
RUN apk add yarn

WORKDIR /app
RUN yarn install

CMD tail -f /dev/null
