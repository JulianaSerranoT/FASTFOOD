# ./pyspark/generate_orders_csv.py

import mysql.connector
import pandas as pd
import os
import logging
import matplotlib.pyplot as plt

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')

def export_orders_to_csv():
    try:
        logging.info("Conectando a la base de datos MySQL...")
        conn = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'db'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '123456789'),
            database=os.getenv('MYSQL_DATABASE', 'fastfood')
        )
        cursor = conn.cursor()
        logging.info("Conexión establecida. Ejecutando consulta...")

        query = "SELECT * FROM orden"
        df = pd.read_sql(query, conn)
        output_dir = '/app/output'
        os.makedirs(output_dir, exist_ok=True)
        csv_file_path = os.path.join(output_dir, 'orden.csv')

        logging.info(f"Escribiendo el CSV en: {csv_file_path}")
        df.to_csv(csv_file_path, index=False)

        logging.info("CSV generado exitosamente.")

        # Verificar si el DataFrame no está vacío
        if not df.empty:
            # Convertir 'fechahora' a datetime
            logging.info("Convirtiendo 'fechahora' a tipo datetime...")
            df['fechahora'] = pd.to_datetime(df['fechahora'])

            # 1. Gráfica de Conteo de Órdenes por Usuario
            logging.info("Generando gráfica de conteo de órdenes por usuario...")
            orders_count = df['usuarioCliente'].value_counts()
            plt.figure(figsize=(10, 6))
            orders_count.plot(kind='bar', color='skyblue')
            plt.title('Cantidad de Órdenes por Usuario')
            plt.xlabel('Usuario Cliente')
            plt.ylabel('Número de Órdenes')
            plt.xticks(rotation=45)
            plt.tight_layout()
            orders_count_plot_path = os.path.join(output_dir, 'orders_count_per_user.png')
            plt.savefig(orders_count_plot_path)
            plt.close()
            logging.info(f"Gráfica de conteo de órdenes guardada en: {orders_count_plot_path}")

            # 2. Gráfica de Total Gastado por Usuario
            logging.info("Generando gráfica de total gastado por usuario...")
            total_spent = df.groupby('usuarioCliente')['totalcuenta'].sum().sort_values(ascending=False)
            plt.figure(figsize=(10, 6))
            total_spent.plot(kind='bar', color='salmon')
            plt.title('Total Gastado por Usuario')
            plt.xlabel('Usuario Cliente')
            plt.ylabel('Total Gastado ($)')
            plt.xticks(rotation=45)
            plt.tight_layout()
            total_spent_plot_path = os.path.join(output_dir, 'total_spent_per_user.png')
            plt.savefig(total_spent_plot_path)
            plt.close()
            logging.info(f"Gráfica de total gastado por usuario guardada en: {total_spent_plot_path}")

            # 3. Promedio de Gastos por Usuario
            logging.info("Generando gráfica de promedio de gastos por usuario...")
            average_spent = df.groupby('usuarioCliente')['totalcuenta'].mean().sort_values(ascending=False)
            plt.figure(figsize=(10, 6))
            average_spent.plot(kind='bar', color='green')
            plt.title('Promedio de Gastos por Usuario')
            plt.xlabel('Usuario Cliente')
            plt.ylabel('Promedio Gastado ($)')
            plt.xticks(rotation=45)
            plt.tight_layout()
            average_spent_plot_path = os.path.join(output_dir, 'average_spent_per_user.png')
            plt.savefig(average_spent_plot_path)
            plt.close()
            logging.info(f"Gráfica de promedio de gastos por usuario guardada en: {average_spent_plot_path}")

            # 4. Tabla de Ventas por Mes
            logging.info("Generando tabla de ventas por mes...")
            df['mes'] = df['fechahora'].dt.to_period('M')
            ventas_por_mes = df.groupby('mes')['totalcuenta'].sum().reset_index()
            ventas_por_mes.rename(columns={'totalcuenta': 'Total Vendido'}, inplace=True)
            ventas_por_mes_csv = os.path.join(output_dir, 'ventas_por_mes.csv')
            ventas_por_mes.to_csv(ventas_por_mes_csv, index=False)
            logging.info(f"Tabla de ventas por mes guardada en: {ventas_por_mes_csv}")

            # 5. Gráfica de Ventas por Mes
            logging.info("Generando gráfica de ventas por mes...")
            plt.figure(figsize=(10, 6))
            plt.plot(ventas_por_mes['mes'].astype(str), ventas_por_mes['Total Vendido'], marker='o', linestyle='-')
            plt.title('Ventas por Mes')
            plt.xlabel('Mes')
            plt.ylabel('Total Vendido ($)')
            plt.xticks(rotation=45)
            plt.tight_layout()
            ventas_por_mes_plot = os.path.join(output_dir, 'ventas_por_mes.png')
            plt.savefig(ventas_por_mes_plot)
            plt.close()
            logging.info(f"Gráfica de ventas por mes guardada en: {ventas_por_mes_plot}")

            # 6. Diagrama de Dispersión de Ventas por Mes (Modificado)
            logging.info("Generando diagrama de dispersión de ventas por mes...")
            plt.figure(figsize=(10, 6))
            plt.scatter(ventas_por_mes['mes'].astype(str), ventas_por_mes['Total Vendido'], color='blue', alpha=0.6)
            plt.title('Diagrama de Dispersión de Ventas por Mes')
            plt.xlabel('Mes')
            plt.ylabel('Total Vendido ($)')
            plt.xticks(rotation=45)
            plt.tight_layout()
            scatter_plot_path = os.path.join(output_dir, 'scatter_ventas_por_mes.png')
            plt.savefig(scatter_plot_path)
            plt.close()
            logging.info(f"Diagrama de dispersión de ventas por mes guardado en: {scatter_plot_path}")

            # 7. Ventas por Año
            logging.info("Generando tabla y gráfica de ventas por año...")
            df['anio'] = df['fechahora'].dt.year
            ventas_por_anio = df.groupby('anio')['totalcuenta'].sum().reset_index()
            ventas_por_anio.rename(columns={'totalcuenta': 'Total Vendido'}, inplace=True)
            ventas_por_anio_csv = os.path.join(output_dir, 'ventas_por_anio.csv')
            ventas_por_anio.to_csv(ventas_por_anio_csv, index=False)
            logging.info(f"Tabla de ventas por año guardada en: {ventas_por_anio_csv}")

            # Gráfica de ventas por año
            plt.figure(figsize=(10, 6))
            plt.plot(ventas_por_anio['anio'].astype(str), ventas_por_anio['Total Vendido'], marker='o', linestyle='-')
            plt.title('Ventas por Año')
            plt.xlabel('Año')
            plt.ylabel('Total Vendido ($)')
            plt.xticks(rotation=45)
            plt.tight_layout()
            ventas_por_anio_plot = os.path.join(output_dir, 'ventas_por_anio.png')
            plt.savefig(ventas_por_anio_plot)
            plt.close()
            logging.info(f"Gráfica de ventas por año guardada en: {ventas_por_anio_plot}")

            # 8. Clientes Top (Más Órdenes y Mayor Gastos)
            logging.info("Identificando clientes top...")
            top_client_orders = orders_count.idxmax()
            top_orders = orders_count.max()
            top_client_spent = total_spent.idxmax()
            top_spent = total_spent.max()
            logging.info(f"Cliente con más órdenes: {top_client_orders} ({top_orders} órdenes)")
            logging.info(f"Cliente que más ha gastado: {top_client_spent} (${top_spent})")

            # Guardar en archivo de texto
            with open(os.path.join(output_dir, 'top_clients.txt'), 'w') as f:
                f.write(f"Cliente con más órdenes: {top_client_orders} ({top_orders} órdenes)\n")
                f.write(f"Cliente que más ha gastado: {top_client_spent} (${top_spent})\n")
            logging.info("Información de clientes top guardada en: top_clients.txt")

            # 9. Promedio de Órdenes por Usuario
            promedio_ordenes = orders_count.mean()
            logging.info(f"Promedio de órdenes por usuario: {promedio_ordenes:.2f}")

            # 10. Distribución de Ventas
            logging.info("Generando gráfica de distribución de ventas...")
            plt.figure(figsize=(10, 6))
            df['totalcuenta'].plot(kind='hist', bins=20, color='purple', edgecolor='black')
            plt.title('Distribución de Ventas')
            plt.xlabel('Total Gastado ($)')
            plt.ylabel('Frecuencia')
            plt.tight_layout()
            distribucion_plot = os.path.join(output_dir, 'distribucion_ventas.png')
            plt.savefig(distribucion_plot)
            plt.close()
            logging.info(f"Gráfica de distribución de ventas guardada en: {distribucion_plot}")

            # 11. Ventas por Hora del Día
            logging.info("Generando tabla y gráfica de ventas por hora...")
            df['hora'] = df['fechahora'].dt.hour
            ventas_por_hora = df.groupby('hora')['totalcuenta'].sum().reset_index()
            ventas_por_hora.rename(columns={'totalcuenta': 'Total Vendido'}, inplace=True)
            ventas_por_hora_csv = os.path.join(output_dir, 'ventas_por_hora.csv')
            ventas_por_hora.to_csv(ventas_por_hora_csv, index=False)
            logging.info(f"Tabla de ventas por hora guardada en: {ventas_por_hora_csv}")

            # Gráfica de ventas por hora
            plt.figure(figsize=(10, 6))
            plt.bar(ventas_por_hora['hora'], ventas_por_hora['Total Vendido'], color='orange')
            plt.title('Ventas por Hora del Día')
            plt.xlabel('Hora del Día')
            plt.ylabel('Total Vendido ($)')
            plt.xticks(range(0, 24))
            plt.tight_layout()
            ventas_por_hora_plot = os.path.join(output_dir, 'ventas_por_hora.png')
            plt.savefig(ventas_por_hora_plot)
            plt.close()
            logging.info(f"Gráfica de ventas por hora guardada en: {ventas_por_hora_plot}")

            # 12. Diagrama de Caja de Ventas por Usuario
            logging.info("Generando diagrama de caja de ventas por usuario...")
            plt.figure(figsize=(10, 6))
            df.boxplot(column='totalcuenta', by='usuarioCliente', grid=False, patch_artist=True,
                      boxprops=dict(facecolor='lightblue'))
            plt.title('Distribución de Ventas por Usuario')
            plt.suptitle('')  # Eliminar el título automático
            plt.xlabel('Usuario Cliente')
            plt.ylabel('Total Vendido ($)')
            plt.xticks(rotation=45)
            plt.tight_layout()
            boxplot_path = os.path.join(output_dir, 'boxplot_ventas_por_usuario.png')
            plt.savefig(boxplot_path)
            plt.close()
            logging.info(f"Diagrama de caja de ventas por usuario guardado en: {boxplot_path}")

        else:
            logging.warning("El DataFrame está vacío. No se generarán gráficas ni tablas adicionales.")

    except mysql.connector.Error as err:
        logging.error(f"ERROR: {err}")
    except Exception as e:
        logging.error(f"ERROR: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            logging.info("Conexión a MySQL cerrada.")

if __name__ == "__main__":
    export_orders_to_csv()

