const express = require('express');
const router = express.Router();
const axios = require('axios');
const ordenesModel = require('../models/ordenesModel');

// Consultar orden por ID
router.get('/ordenes/:id', async (req, res) => {
    const id = req.params.id;
    const result = await ordenesModel.traerOrden(id);
    res.json(result[0]);
});

// Consultar todas las órdenes
router.get('/ordenes', async (req, res) => {
    const result = await ordenesModel.traerOrdenes();
    res.json(result);
});

// Crear una orden
router.post('/ordenes', async (req, res) => {
    const usuario = req.body.usuario; // Trae info del usuario que hace la orden
    const items = req.body.items; // Items, arreglo que dice qué productos compró y qué cantidad

    const totalCuenta = await calcularTotal(items);

    // Si el total es 0 o negativo, retornamos un error
    if (totalCuenta <= 0) {
        return res.status(400).json({ error: 'Total de orden inválido' });
    }

    // Verificamos si hay suficientes unidades de los productos para realizar la orden
    const disponibilidad = await verificarDisponibilidad(items);

    // Si no hay suficientes unidades de los productos, retornamos un error
    if (!disponibilidad) {
        return res.status(400).json({ error: 'No hay disponibilidad de productos' });
    }

    // Creamos la orden
    const response = await axios.get(`http://localhost:3005/usuarios/${usuario}`);
    const { nombre } = response.data;
    const orden = { 
        nombreCliente: nombre, 
        usuarioCliente: usuario, 
        estado: 'creada', // Estado por defecto
        totalCuenta 
    };
    await ordenesModel.crearOrden(orden);

    // Disminuimos la cantidad de unidades de los productos
    await actualizarInventario(items);

    res.status(201).send('Orden creada');
});

// Actualizar solo el estado de una orden
router.put('/ordenes/actualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar el estado (opcional)
    const estadosValidos = ['creada', 'en proceso', 'completada', 'cancelada'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
    }

    try {
        // Actualizar el estado
        const resultado = await ordenesModel.actualizarEstadoOrden(id, estado);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        res.status(200).send('Estado de la orden actualizado');
    } catch (error) {
        console.error('Error al actualizar el estado de la orden:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar una orden
router.delete('/ordenes/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await ordenesModel.eliminarOrden(id);
        if (result.affectedRows > 0) {
            res.json({ message: `Orden con ID: '${id}' eliminada exitosamente` });
        } else {
            res.status(404).json({ message: `Orden con ID: '${id}' no encontrada` });
        }
    } catch (error) {
        console.error('Error al eliminar orden:', error);
        res.status(500).json({ message: 'Error al eliminar la orden', error });
    }
});

// Función para ver ordenes por usuario 

router.get('/ordenes/usuario/:usuarioCliente', async (req, res) => {
    // Extrae el parámetro dinámico 'usuario' de la URL
    const usuarioCliente = req.params.usuarioCliente;

    // Log para verificar que el parámetro 'usuario' se ha recibido correctamente
    console.log('Usuario recibido en el controlador:', usuarioCliente);   


    try {
        // Llama al modelo para traer los datos del usuario con el nombre de usuario proporcionado
        const result = await ordenesModel.traerordenesUsuario(usuarioCliente);

        // Verifica si se encontró un usuario con ese nombre de usuario
        if (result.length > 0) {
            // Si se encontró, envía el primer usuario en el arreglo de resultados como respuesta en formato JSON
            res.json(result[0]);
        } else {
            // Si no se encontró ningún usuario, envía un mensaje con estado 404 (no encontrado)
            res.status(404).json({ message: 'No se encontró ninguna orden para ese usuario.' });
        }
    } catch (error) {
        // Si hay un error al buscar el usuario, lo registra en la consola y envía un mensaje de error al cliente
        console.error('Error en el controlador:', error);
        res.status(500).json({ message: 'Error al buscar el usuario.', error });
    }
});


// Función para calcular el total de la orden
async function calcularTotal(items) {
    let ordenTotal = 0;
    for (const producto of items) {
        const response = await axios.get(`http://localhost:3003/productos/${producto.id}`);
        ordenTotal += response.data.precio * producto.cantidad;
    }
    return ordenTotal;
}

// Función para verificar si hay suficientes unidades de los productos para realizar la orden
async function verificarDisponibilidad(items) {
    let disponibilidad = true;
    for (const producto of items) {
        const response = await axios.get(`http://localhost:3003/productos/${producto.id}`);
        if (response.data.cantidad < producto.cantidad) {
            disponibilidad = false;
            break;
        }
    }
    return disponibilidad;
}

// Función para actualizar el inventario de productos
async function actualizarInventario(items) {
    for (const producto of items) {
        const response = await axios.get(`http://localhost:3003/productos/${producto.id}`);
        const cantidadActual = response.data.cantidad; // Cambiado de inventario a cantidad
        const nuevaCantidad = cantidadActual - producto.cantidad;

        // Validar que la nueva cantidad no sea negativa
        if (nuevaCantidad < 0) {
            throw new Error(`No hay suficiente inventario para el producto ${producto.id}`);
        }

        await axios.put(`http://localhost:3003/productos/${producto.id}`, {
            cantidad: nuevaCantidad // Asegúrate de enviar la nueva cantidad
        });
    }
}

module.exports = router;
