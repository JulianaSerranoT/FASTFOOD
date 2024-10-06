FROM node

EXPOSE 3001

WORKDIR /notificaciones

COPY  controllers /notificaciones/src/controllers
COPY  models /notificaciones/src/models
COPY  index.js /notificaciones/src

RUN npm init --yes
RUN npm install express morgan mysql mysql2 axios

CMD node /src/index.js