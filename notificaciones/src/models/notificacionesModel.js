const mysql = require('mysql2/promise');
const axios = require('axios'); // Importa axios

const connection = mysql.createPool({
    host: 'db',
    user: 'root',
    password: '123456789',
    port:'3306',
    database: 'fastfood'
});

async function verificarTareaExiste(idTarea) {
    
    // URL de las APIs de tareas y usuarios
    const tareasApiUrl = 'http://notificaciones:3004/tareas';

    try {
        const response = await axios.get(`${tareasApiUrl}/${idTarea}`);
        if (response.data && Object.keys(response.data).length > 0) {
            // Si la respuesta tiene datos, significa que la tarea existe
            return true;
        }
        return false; // Si no hay datos, la tarea no existe
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return false; // La tarea no existe (error 404)
        }
        throw error; // Re-lanza el error si es otro tipo de problema
    }
}

// Función para verificar si un usuario existe
async function verificarUsuarioExiste(usuario) {
    // URL de las APIs de usuarios
    const usuariosApiUrl = 'http://usuarios:3005/usuarios'; 
    try {
        const response = await axios.get(`${usuariosApiUrl}/${usuario}`);
        return response.status === 200; // Si el estado es 200, el usuario existe
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return false; // El usuario no existe
        }
        throw error; // Re-lanza el error si es otro tipo de problema
    }
}

async function traerNotificaciones() {
    const result = await connection.query('SELECT * FROM notificacion');
    return result[0];
}


async function traerNotificacionUsuario(trabajadorAsignado) {
    try {
        // Consulta SQL para obtener todas las notificaciones del usuario asignado
        const [rows] = await connection.query('SELECT * FROM notificacion WHERE trabajadorAsignado = ?', [trabajadorAsignado]);
        return rows;  // Retorna todas las filas
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        throw error;
    }
}
async function traerNotificacion(id) {
    const result = await connection.query('SELECT * FROM notificacion WHERE id = ?', id);
    return result[0];
}

async function crearNotificacion(id, idTarea, trabajadorAsignado, estado, fechaHora) {
    const result = await connection.query('INSERT INTO notificacion  VALUES(?,?,?,?,?)', [id, idTarea, trabajadorAsignado, estado, fechaHora]);
    return result;
}

async function actualizarNotificacion(id, idTarea, trabajadorAsignado, estado, fechaHora) {
    const result = await connection.query('UPDATE notificacion SET idTarea = ?, trabajadorAsignado = ?, estado = ?, fechaHora = ? WHERE id = ?',[idTarea, trabajadorAsignado, estado, fechaHora,id]);
    return result;
}

async function eliminarNotificacion(id) {
    const result = await connection.query('DELETE FROM notificacion WHERE id=?', [id]);
    return result[0];
}

module.exports = {
    verificarTareaExiste, verificarUsuarioExiste, traerNotificaciones,traerNotificacionUsuario, traerNotificacion,crearNotificacion,actualizarNotificacion,eliminarNotificacion
};
