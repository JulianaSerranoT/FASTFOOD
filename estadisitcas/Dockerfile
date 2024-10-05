FROM node

EXPOSE 3006

WORKDIR /estadisticas

COPY  controllers /estadisticas/controllers
COPY  models /estadisticas/models
COPY  index.js /estadisticas

RUN npm init --yes
RUN npm intsall express morgan mysql mysql2 axios

CMD node index.js