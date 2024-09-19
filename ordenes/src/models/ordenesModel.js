const mysql = require('mysql2/promise');

// Configuración de la conexión a la base de datos
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306, // Cambiado a 3306, el puerto por defecto para MySQL/MariaDB
    database: 'ordendbf'
});

// Función para crear una orden
async function crearOrden(orden) {
    const { nombreCliente, usuarioCliente, totalCuenta } = orden;
    const result = await connection.query(
        'INSERT INTO orden (nombreCliente, usuarioCliente, totalcuenta, fechahora) VALUES ( ?, ?, ?, NOW())',
        [nombreCliente, usuarioCliente, totalCuenta]
    );
    return result;
}

// Función para obtener una orden por ID
async function traerOrden(id) {
    const [rows] = await connection.query('SELECT * FROM orden WHERE id = ?', [id]);
    return rows;
}

// Función para obtener todas las órdenes
async function traerOrdenes() {
    const [rows] = await connection.query('SELECT * FROM orden');
    return rows;
}

module.exports = {
    crearOrden,
    traerOrden,
    traerOrdenes
};

