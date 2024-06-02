FROM node:18-bullseye

RUN apt-get update

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app/

RUN npm install

EXPOSE 3000

USER node

CMD [ "npm", "start"]
