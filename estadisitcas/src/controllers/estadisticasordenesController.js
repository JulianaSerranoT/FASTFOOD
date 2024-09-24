const express = require('express');
const router = express.Router();
const axios = require('axios');

// Obtener las estadísticas de las órdenes agrupadas por usuarioCliente
router.get('/estadisticas/ordenes', async (req, res) => {
    try {
        // Establecer los encabezados CORS
        res.setHeader('Access-Control-Allow-Origin', '*');  // Permitir el acceso desde cualquier origen
        res.setHeader('Access-Control-Allow-Methods', 'GET');  // Métodos permitidos
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Encabezados permitidos

        // Hacemos una solicitud a la API de órdenes para obtener todas las órdenes
        const response = await axios.get('http://localhost:3002/ordenes');
        const ordenes = response.data;

        if (ordenes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron órdenes.' });
        }

        // Agrupamos las órdenes por usuarioCliente, contamos las órdenes y sumamos el total gastado
        const estadisticas = ordenes.reduce((acc, orden) => {
            const usuario = orden.usuarioCliente;

            // Si el usuario ya está en las estadísticas, actualizamos sus valores
            if (acc[usuario]) {
                acc[usuario].cantidadOrdenes += 1;
                acc[usuario].totalGastado += orden.totalcuenta;
            } else {
                // Si es un nuevo usuario, lo añadimos al objeto
                acc[usuario] = {
                    usuarioCliente: usuario,
                    cantidadOrdenes: 1,
                    totalGastado: orden.totalcuenta
                };
            }

            return acc;
        }, {});

        // Convertimos el objeto en un array
        const estadisticasArray = Object.values(estadisticas);

        // Ordenamos el array por cantidad de órdenes en orden descendente
        estadisticasArray.sort((a, b) => b.cantidadOrdenes - a.cantidadOrdenes);

        // Enviamos las estadísticas al cliente
        res.json(estadisticasArray);
    } catch (error) {
        console.error('Error al obtener las estadísticas de órdenes:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;
