FROM node

EXPOSE 3002

WORKDIR /ordenes

COPY  controllers /ordenes/controllers
COPY  models /ordenes/models
COPY  index.js /ordenes

RUN npm init --yes
RUN npm intsall express morgan mysql mysql2 axios

CMD node index.js