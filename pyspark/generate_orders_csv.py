# ./pyspark/generate_orders_csv.py

import mysql.connector
import pandas as pd
import os
import logging

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

