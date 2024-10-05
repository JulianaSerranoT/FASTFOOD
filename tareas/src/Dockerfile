FROM node

EXPOSE 3004

WORKDIR /tareas

COPY  controllers /tareas/controllers
COPY  models /tareas/models
COPY  index.js /tareas/

RUN npm init --yes
RUN npm intsall express morgan mysql mysql2 axios

CMD node index.js