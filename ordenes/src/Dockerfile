FROM node

EXPOSE 3002

WORKDIR /ordenes

COPY  controllers /ordenes/src/controllers
COPY  models /ordenes/src/models
COPY  index.js /ordenes/src/

RUN npm init --yes
RUN npm install express morgan mysql mysql2 axios

FROM bitnami/spark:latest AS spark-analysis

# Instalar matplotlib para gráficos
RUN pip install matplotlib

# Copiar el script de análisis en Python
COPY analisis.py /app/analisis.py

# Comando para ejecutar el análisis con PySpark
CMD ["spark-submit", "/app/analisis.py"]

# Etapa final: Integración de las dos etapas en un único contenedor
FROM node:18

# Copiar la aplicación Node.js desde la primera etapa
COPY --from=node-app /ordenes /ordenes
WORKDIR /ordenes

# Copiar PySpark y el script de análisis desde la segunda etapa
COPY --from=spark-analysis /app /app

# Exponer el puerto de la aplicación Node.js
EXPOSE 3002

CMD node ./src/index.js
