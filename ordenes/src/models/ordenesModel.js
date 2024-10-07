const mysql = require('mysql2/promise');

// Configuración de la conexión a la base de datos
const connection = mysql.createPool({
    host: 'db',
    user: 'root',
    password: '123456789',
    port: 3306,
    database: 'fastfood'
});

// Función para crear una orden
async function crearOrden(orden) {
    const { nombreCliente, usuarioCliente,estado, totalCuenta } = orden;
    const result = await connection.query(
        'INSERT INTO orden (nombreCliente, usuarioCliente,estado, totalcuenta, fechahora) VALUES (?,?, ?, ?, NOW())',
        [nombreCliente, usuarioCliente,estado, totalCuenta]
    );
    return result;
}

async function actualizarEstadoOrden(id, estado) {
    const result = await connection.query('UPDATE orden SET estado = ? WHERE id = ?', [estado, id]);
    return result[0]; // Devuelve el resultado
}

// Función para obtener una orden por ID
async function traerOrden(id) {
    const [rows] = await connection.query('SELECT * FROM orden WHERE id = ?', [id]);
    return rows;
}

async function traerordenesUsuario(usuarioCliente) {
    try {
        // Consulta SQL para obtener todas las notificaciones del usuario asignado
        const [rows] = await connection.query('SELECT * FROM orden WHERE usuarioCliente = ?', [usuarioCliente]);
        return rows;  // Retorna todas las filas
    } catch (error) {
        console.error('Error al obtener las ordenes:', error);
        throw error;
    }
}

// Función para obtener todas las órdenes
async function traerOrdenes() {
    const [rows] = await connection.query('SELECT * FROM orden');
    return rows;
}

// Función para eliminar una orden por ID
async function eliminarOrden(id) {
    const result = await connection.query('DELETE FROM orden WHERE id = ?', [id]);
    return result[0];
}

module.exports = {
    crearOrden,
    traerOrden,
    traerOrdenes,
    eliminarOrden ,
    traerordenesUsuario,
    actualizarEstadoOrden
};
