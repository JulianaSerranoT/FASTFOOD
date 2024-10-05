FROM node

EXPOSE 3001

WORKDIR /notificaciones

COPY  controllers /notificaciones/controllers
COPY  models /notificaciones/models
COPY  index.js /notificaciones

RUN npm init --yes
RUN npm intsall express morgan mysql mysql2 axios

CMD node index.js