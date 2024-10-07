FROM node

EXPOSE 3002

WORKDIR /ordenes

COPY  controllers /ordenes/src/controllers
COPY  models /ordenes/src/models
COPY  index.js /ordenes/src/

RUN npm init --yes
RUN npm install express morgan mysql mysql2 axios

CMD node ./src/index.js
