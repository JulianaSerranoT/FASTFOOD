FROM node

EXPOSE 3005

WORKDIR /usuarios

COPY  controllers /usuarios/controllers
COPY  models /usuarios/models
COPY  index.js /usuarios/

RUN npm init --yes
RUN npm intsall express morgan mysql mysql2 axios

CMD node index.js