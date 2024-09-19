const { Router } = require('express');
const router = Router();
const tareasModel = require('../models/tareasModel');
const e = require('express');
//___________________________________________________________________________________________________________________________________
//listar
router.get('/tareas', async (req, res) => {
    var result;
    result = await tareasModel.traerTareas();
    //console.log(result);
    res.json(result);
});

router.get('/tareas/:id', async (req, res) => {
    const id= req.params.id;
    var result;
    result = await tareasModel.traerid(id) ;
    res.json(result[0]);
});

router.get('/tareas/usuario/:usuarioAsignado', async (req, res) => {
    try {
        const usuarioAsignado = req.params.usuarioAsignado;
        const result = await tareasModel.traerTareaUsuario(usuarioAsignado);
        res.json(result); // Devuelve todas las tareas asignadas
    } catch (error) {
        console.error('Error al traer tareas:', error);
        res.status(500).json({ error: 'Error al traer tareas' });
    }
});


//___________________________________________________________________________________________________________________________________
// crear

router.post('/tareas', async (req, res) => {
    const descripcion = req.body.descripcion;
    const usuarioAsignado = req.body.usuarioAsignado;
    const estado = req.body.estado || 'creada'; // Valor por defecto 'creada' si no se proporciona
    const prioridad = req.body.prioridad;
    // Validar campos obligatorios
    if (!descripcion || !usuarioAsignado || !estado ||!prioridad) {
        return res.status(400).json({ message: 'Todos los campos (descripcion, usuarioAsignado,estado y prioridad) son obligatorios.' });
    }

    // Validar que el estado sea correcto
    const estadoPermitidos = ['creada', 'en proceso', 'terminada'];
    if (!estadoPermitidos.includes(estado)) {
        console.log('Estado no permitido:', estado); // Log para el estado no permitido
        return res.status(400).send('Estado no permitido');
    }

    // Validar que el usuario asignado exista
    try {
        const usuarioExiste = await tareasModel.verificarUsuarioExiste(usuarioAsignado);
        if (!usuarioExiste) {
            return res.status(404).json({ message: 'El usuario asignado no existe.' });
        }

        const result = await tareasModel.crearTarea(descripcion, usuarioAsignado, estado,prioridad);
        res.status(201).json({ id: result.insertId, message: 'Tarea creada exitosamente.' });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ message: 'Error al crear la tarea.', error });
    }
});
//___________________________________________________________________________________________________________________________________
//actualizar

router.put('/tareas/:id', async (req, res) => {

    const id = req.body.id;
    const descripcion = req.body.descripcion;
    const usuarioAsignado = req.body.usuarioAsignado;
    const estado = req.body.estado;
    const prioridad = req.body.prioridad;
    // Validar campos obligatorios
    if (!descripcion ||!usuarioAsignado || !estado || prioridad) {
        return res.status(400).json({ message: 'Todos los campos (descripcion, usuarioAsignado, estado, prioridad) son obligatorios.' });
    }
    //verificar estado 
    const estadoPermitidos = ['creada', 'en proceso', 'terminada'];
    if (!estadoPermitidos.includes(estado)) {
        console.log('Estado no permitido:', estado); // Log para el estado no permitido 
        return res.status(400).send('Estado no permitido');
    }

    // Validar que el usuario asignado exista
    try {
        const usuarioExiste = await tareasModel.verificarUsuarioExiste(usuarioAsignado);
        if (!usuarioExiste) {
            return res.status(404).json({ message: 'El usuario asignado no existe.' });
        }

        await tareasModel.actualizarTarea(id,descripcion, usuarioAsignado, estado,prioridad);
        res.json({ message: 'Tarea actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ message: 'Error al actualizar la tarea.', error });
    }

});

//___________________________________________________________________________________________________________________________________
//eliminar

router.delete('/tareas/:id', async (req, res) => {
    const id = req.params.id;
    var result;
    result = await tareasModel.eliminarTarea(id);
    //console.log(result);
    res.send("tarea eliminado");
});


module.exports = router;
