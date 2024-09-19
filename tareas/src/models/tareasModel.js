const mysql = require('mysql2/promise');
const axios = require('axios');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'tareasdb11'
});

async function verificarUsuarioExiste(usuario) {
    // URL de la API de usuarios
    const usuariosApiUrl = 'http://localhost:3001/usuarios';
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

// Funciones para manejar tareas
async function traerTareas() {
    const result = await connection.query('SELECT * FROM tareas');
    return result[0];
}


async function traerTareaUsuario(usuarioAsignado) {
    const result = await connection.query('SELECT * FROM tareas WHERE usuarioAsignado = ?',usuarioAsignado);
    return result[0];
}

async function traerid(id) {
    const result = await connection.query('SELECT * FROM tareas WHERE id = ?', id);
    return result[0];
}

//async function crearTarea(id,descripcion, usuarioAsignado, estado, prioridad) {
    //const result = await connection.query('INSERT INTO tareas VALUES(?,?,?,?,?)', [id,descripcion, usuarioAsignado, estado, prioridad]);
    //return result;
//}
async function crearTarea(descripcion, usuarioAsignado, estado, prioridad) {
    const [result] = await connection.query(
        'INSERT INTO tareas (descripcion, usuarioAsignado, estado, prioridad) VALUES (?, ?, ?, ?)',
        [descripcion, usuarioAsignado, estado, prioridad]
    );
    return result;  // `result.insertId` contendrá el ID de la tarea creada
}

async function actualizarTarea(id,descripcion, usuarioAsignado, estado, prioridad) {
    const result = await connection.query('UPDATE tareas SET descripcion = ?, usuarioAsignado = ?, estado = ?, prioridad = ? WHERE id = ?', [descripcion,usuarioAsignado, estado, prioridad, id]);
    return result;
}

async function eliminarTarea(id) {
    const result = await connection.query('DELETE FROM tareas WHERE id=?', [id]);
    return result[0];
}

module.exports = {
    verificarUsuarioExiste,traerTareas,traerid, traerTareaUsuario,crearTarea,actualizarTarea,eliminarTarea
};
