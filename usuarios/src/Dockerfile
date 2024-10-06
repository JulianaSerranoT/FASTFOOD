FROM node

EXPOSE 3005

WORKDIR /usuarios

COPY  controllers /usuarios/src/controllers
COPY  models /usuarios/src/models
COPY  index.js /usuarios/src

RUN npm init --yes
RUN npm install express morgan mysql mysql2 axios

CMD node /src/index.js