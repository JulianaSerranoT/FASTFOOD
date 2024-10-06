const mysql = require('mysql2/promise');


const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port:'3306',
    database: '123456'
});


async function traerUsuarios() {
    const result = await connection.query('SELECT * FROM usuarios');
    return result[0];
}


async function traerUsuario(usuario) {
    const result = await connection.query('SELECT * FROM usuarios WHERE usuario = ?', usuario);
    return result[0];
}

async function traerUsuarioRol(usuario) {
    const result = await connection.query('SELECT * FROM usuarios WHERE rol = ?', usuario);
    return result[0];
}

async function validarUsuario(usuario, password) {
    const result = await connection.query('SELECT * FROM usuarios WHERE usuario = ? AND password = ?', [usuario, password]);
    return result[0];
}


async function crearUsuario(nombre, usuario, password, rol) {
    const result = await connection.query('INSERT INTO usuarios  VALUES(?,?,?,?)', [nombre, usuario, password, rol]);
    return result;
}

async function actualizarUsuario(nombre, usuario, password, rol) {
    const result = await connection.query('UPDATE usuarios SET nombre = ?, password = ?, rol = ? WHERE usuario = ?',[nombre, password, rol, usuario]);
    return result;
}

async function eliminarUsuario(usuario) {
    const result = await connection.query('DELETE FROM usuarios WHERE usuario=?', [usuario]);
    return result[0];
}


module.exports = {
    traerUsuarios, traerUsuario, traerUsuarioRol, validarUsuario, crearUsuario, eliminarUsuario, actualizarUsuario
};