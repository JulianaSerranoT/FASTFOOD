FROM node

EXPOSE 3004

WORKDIR /tareas

COPY  controllers /tareas/src/controllers
COPY  models /tareas/src/models
COPY  index.js /tareas/src

RUN npm init --yes
RUN npm intsall express morgan mysql mysql2 axios

CMD node index.js