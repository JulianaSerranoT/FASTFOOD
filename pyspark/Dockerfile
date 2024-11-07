# ./pyspark/Dockerfile

FROM bitnami/spark:latest

# Actualizar el sistema e instalar pip
USER root
RUN mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Instalar mysql-connector-python
RUN pip3 install mysql-connector-python pandas

# Copiar el script wait-for-it.sh y hacerlo ejecutable
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod 777 /wait-for-it.sh

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el script Python al contenedor
COPY generate_orders_csv.py /app/generate_orders_csv.py

# (Opcional) Copiar el conector JDBC de MySQL si es necesario
COPY mysql-connector-java-8.0.30.jar /opt/spark/jars/mysql-connector-java.jar

# Cambiar al usuario spark para ejecutar los comandos
USER 1001

