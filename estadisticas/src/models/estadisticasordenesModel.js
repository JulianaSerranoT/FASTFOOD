
const axios = require('axios');


const estadisticasOrdenesModel = {
    // Método para obtener las estadísticas de órdenes por usuario
    async obtenerEstadisticas() {
        try {
            // Hacemos la solicitud a la API de órdenes para obtener todas las órdenes
            const response = await axios.get('http://localhost:3002/ordenes');
            const ordenes = response.data;

            // Si no hay órdenes, retornamos un array vacío
            if (ordenes.length === 0) {
                return [];
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

            return estadisticasArray;
        } catch (error) {
            console.error('Error al obtener estadísticas de órdenes:', error);
            throw error;
        }
    }
};

module.exports = estadisticasOrdenesModel;
