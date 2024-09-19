const { Router } = require('express');
const router = Router();
const productosModel = require('../models/productosModel');

//-----------------------------------------------------------------------------------------------------
//llamar productos
router.get('/productos', async (req, res) => {
    var result;
    result = await productosModel.traerProductos() ;
    //console.log(result);
    res.json(result);
});

//-----------------------------------------------------------------------------------------------------
//llamar producto
router.get('/productos/:id', async (req, res) => {
    const id = req.params.id;

    // Log para verificar que el parámetro 'usuario' se ha recibido correctamente
    console.log('ID recibido en el controlador:', id);

    try {
        const result = await productosModel.traerProducto(id) ;

        // Verifica si se encontró un producto con ese ID
        if (result.length > 0) {
            // Si se encontró, envía el primer producto en el arreglo de resultados como respuesta en formato JSON
            res.json(result[0]);  
        } else {
            // Si no se encontró ningún usuario, envía un mensaje con estado 404 (no encontrado)
            res.status(404).json({ message: 'No se encontró el usuario con ese nombre.' });         
        }

    } catch (error) {
        // Si hay un error al buscar el usuario, lo registra en la consola y envía un mensaje de error al cliente
        console.error('Error en el controlador:', error);
        res.status(500).json({ message: 'Error al buscar el producto.', error });
    }
});

//-----------------------------------------------------------------------------------------------------
//crear producto
router.post('/productos', async (req, res) => {
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const cantidad = req.body.cantidad;
    
    var result = await productosModel.crearProducto(nombre, descripcion, precio, cantidad);
    res.send("producto creado");
});

//-----------------------------------------------------------------------------------------------------
//actualizar producto
router.put('/productos/:id', async (req, res) => {
    //const nombre = req.body.nombre;
    //const descripcion = req.body.descripcion;
    //const precio = req.body.precio;
    const cantidad = req.body.cantidad;
    const id = req.params.id;
    
    var result = await productosModel.actualizarProducto(id, cantidad);
    res.send("Inventerio actualizado");
});

//-----------------------------------------------------------------------------------------------------
//eliminar productos
router.delete('/productos/:id', async (req, res) => {
    const id = req.params.id;

    // Log para verificar el producto que se desea eliminar
    console.log('producto recibido para eliminar:', id);

    try {
        const result = await productosModel.eliminarProducto(id) ;

        if (result.affectedRows > 0) {
            // Si el usuario fue eliminado correctamente
            res.json({ message: `el prodcuto con ID: '${id}' eliminado exitosamente` });   

        } else {
            // Si el usuario no existe en la base de datos
            res.status(404).json({ message: `El producto con ID: '${id}' que desea eliminar no existe` });
        }
    } catch (error) {
        // Si ocurre un error durante la eliminación
        console.error('Error en el controlador:', error);
        res.status(500).json({ message: 'Error al intentar eliminar el usuario', error });
    }
});


module.exports = router;