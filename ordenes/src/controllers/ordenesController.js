const express = require('express');
const router = express.Router();
const axios = require('axios');
const ordenesModel = require('../models/ordenesModel');


router.get('/ordenes/:id', async (req, res) => {
const id = req.params.id;
var result;
result = await ordenesModel.traerOrden(id) ;
res.json(result[0]);
});

//consultar todas las ordenes
router.get('/ordenes', async (req, res) => {
var result;
result = await ordenesModel.traerOrdenes() ;
res.json(result);
});

//Crear una orden. 
router.post('/ordenes', async (req, res) => {
const usuario = req.body.usuario; //trae info del user que hace la orden
const items = req.body.items; //items. Arreglo que dice que productos el user compro y que cantidad compró

const totalCuenta = await calcularTotal(items);


// Si el total es 0 o negativo, retornamos un error
if (totalCuenta <= 0) {
return res.json({ error: 'Invalid order total' });
}


// Verificamos si hay suficientes unidades de los productos para realizar la orden
const disponibilidad = await verificarDisponibilidad(items);


// Si no hay suficientes unidades de los productos, retornamos un error
if (!disponibilidad) {
return res.json({ error: 'No hay disponibilidad de productos' });
}

// Creamos la orden
const response = await axios.get(`http://localhost:3001/usuarios/${usuario}`);
const { nombre: name, email } = response.data;

const orden = { nombreCliente: name, emailCliente: email, totalCuenta };
await ordenesModel.crearOrden(orden);

// Disminuimos la cantidad de unidades de los productos
await actualizarInventario(items);

res.status(201).send('Orden creada');
});



// Función para calcular el total de la orden
async function calcularTotal(items) {
let ordenTotal = 0;
for (const producto of items) {
const response = await axios.get(`http://localhost:3002/productos/${producto.id}`);
ordenTotal += response.data.precio * producto.cantidad;
}
return ordenTotal;
}


// Función para verificar si hay suficientes unidades de los productos para realizar la orden
async function verificarDisponibilidad(items) {
let disponibilidad = true;
for (const producto of items) {
const response = await axios.get(`http://localhost:3002/productos/${producto.id}`);
if (response.data.inventario < producto.cantidad) {
disponibilidad = false;
break;
}
}
return disponibilidad;
}


// Función para disminuir la cantidad de unidades de los productos
async function actualizarInventario(items) {
for (const producto of items) {
const response = await axios.get(`http://localhost:3002/productos/${producto.id}`);
const inventarioActual = response.data.inventario;
const inv=inventarioActual - producto.cantidad;
await axios.put(`http://localhost:3002/productos/${producto.id}`, {
inventario: inv
});
}
}


module.exports = router;

