const mysql = require('mysql2/promise');


const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port:'3306',
    database: 'productosdbf'
});


async function traerProductos() {
    const result = await connection.query('SELECT * FROM productos ');
    return result[0];
}
async function traerProducto(id) {
    const result = await connection.query('SELECT * FROM productos WHERE id = ?', id);
    return result[0];
}
async function actualizarProducto(id, inventario) {
    const result = await connection.query('UPDATE productos  SET inventario = ? WHERE id = ?', [inventario, id]);
    return result;
}
async function crearProducto(nombre, precio, inventario) {
    const result = await connection.query('INSERT INTO productos  VALUES(null,?,?,?)', [nombre,descripcion,precio, cantidad]);
    return result;
}
async function eliminarProducto(id) {
    const result = await connection.query('DELETE FROM productos WHERE id = ?', id);
    return result[0];
}


module.exports = {
    traerProductos, traerProducto, actualizarProducto, crearProducto, eliminarProducto
}

