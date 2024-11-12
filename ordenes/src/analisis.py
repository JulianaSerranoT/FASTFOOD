import matplotlib.pyplot as plt
from pyspark.sql import SparkSession
from pyspark.sql.functions import col

# Crear la sesión de Spark
spark = SparkSession.builder.appName("AnalisisOrdenes").getOrCreate()

# Conectar a la base de datos MySQL y leer la tabla de órdenes
jdbc_url = "jdbc:mysql://db:3306/fastfood"
df = spark.read.format("jdbc").options(
    url=jdbc_url,
    driver="com.mysql.cj.jdbc.Driver",
    dbtable="ordenes",
    user="root",
    password="123456789"
).load()

# Configurar acumuladores para las estadísticas
cantidad_ordenes_acumulador = spark.sparkContext.accumulator(0)
gasto_total_acumulador = spark.sparkContext.accumulator(0.0)

# Convertir el DataFrame en RDD para aplicar acumuladores
def procesar_fila(row):
    cantidad_ordenes_acumulador.add(1)
    gasto_total_acumulador.add(row["totalcuenta"])
    return (row["usuarioCliente"], row["totalcuenta"])

# Procesar el RDD
rdd = df.rdd.map(procesar_fila)

# Calcular estadísticas por usuario
gasto_por_usuario = rdd.reduceByKey(lambda x, y: x + y)
ordenes_por_usuario = rdd.map(lambda x: (x[0], 1)).reduceByKey(lambda x, y: x + y)

# Convertir a DataFrames para graficar
gasto_por_usuario_df = gasto_por_usuario.toDF(["Usuario", "GastoTotal"]).orderBy("GastoTotal", ascending=False)
ordenes_por_usuario_df = ordenes_por_usuario.toDF(["Usuario", "CantidadOrdenes"]).orderBy("CantidadOrdenes", ascending=False)

# Graficar el gasto por usuario
gasto_por_usuario_pandas = gasto_por_usuario_df.toPandas()
plt.figure(figsize=(10, 6))
plt.bar(gasto_por_usuario_pandas["Usuario"], gasto_por_usuario_pandas["GastoTotal"], color='salmon')
plt.xlabel("Usuario")
plt.ylabel("Dinero Gastado")
plt.title("Dinero Gastado por Usuario")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("/app/gasto_por_usuario.png")

# Graficar la cantidad de órdenes por usuario
ordenes_por_usuario_pandas = ordenes_por_usuario_df.toPandas()
plt.figure(figsize=(10, 6))
plt.bar(ordenes_por_usuario_pandas["Usuario"], ordenes_por_usuario_pandas["CantidadOrdenes"], color='skyblue')
plt.xlabel("Usuario")
plt.ylabel("Cantidad de Órdenes")
plt.title("Cantidad de Órdenes por Usuario")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("/app/ordenes_por_usuario.png")

# Imprimir los resultados de los acumuladores
print(f"Total de Órdenes: {cantidad_ordenes_acumulador.value}")
print(f"Total Gastado: {gasto_total_acumulador.value}")

# Finalizar la sesión de Spark
spark.stop()

