FROM node

EXPOSE 3006

WORKDIR /estadisticas

COPY  controllers /estadisticas/src/controllers
COPY  models /estadisticas/src/models
COPY  index.js /estadisticas/src/

RUN npm init --yes
RUN npm install express morgan mysql mysql2 axios cors

CMD node ./src/index.js
