FROM node

EXPOSE 3003

WORKDIR /productos

COPY  controllers /productos/src/controllers
COPY  models /productos/src/models
COPY  index.js /productos/src/

RUN npm init --yes
RUN npm install express morgan mysql mysql2 axios

CMD node ./src/index.js
