FROM node

EXPOSE 3002

WORKDIR /ordenes

COPY  controllers /ordenes/src/controllers
COPY  models /ordenes/src/models
COPY  index.js /ordenes/src

RUN npm init --yes
RUN npm intsall express morgan mysql mysql2 axios

CMD node index.js