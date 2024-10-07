const { Router } = require('express');
const router = Router();
const notificacionesModel = require('../models/notificacionesModel');

//listar notificaciones
router.get('/notificacion', async (req, res) => {
    var result;
    result = await notificacionesModel.traerNotificaciones() ;
    res.json(result);
});

//___________________________________________________________________________________________________________________________________
//obtener notificacion por trabajadorAsignado

router.get('/notificacion/:trabajadorAsignado', async (req, res) => {
    try {
        const trabajadorAsignado = req.params.trabajadorAsignado;
        const result = await notificacionesModel.traerNotificacionUsuario(trabajadorAsignado);
        res.json(result);  // Devuelve todas las notificaciones
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error al obtener notificaciones', error });
    }
});

//___________________________________________________________________________________________________________________________________
//crear

router.post('/notificacion', async (req, res) => {
    const id = req.body.id;
    const idTarea = req.body.idTarea;
    const trabajadorAsignado = req.body.trabajadorAsignado;
    const estado = req.body.estado;
    
    // Validar campos obligatorios
    if (!idTarea || !trabajadorAsignado || !estado) {
        return res.status(400).json({ message: 'Todos los campos ( idTarea, trabajadorAsignado, estado) son obligatorios.' });
    }

    // Validar estado de notificación
    // Estados permitidos para las notificaciones
    const estadosPermitidos = ['creada', 'en proceso', 'en revisión', 'terminada'];
    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ message: 'Estado no permitido.' });
    }

    // Validar que la tarea asignada exista
    try {
        const tareaExiste = await notificacionesModel.verificarTareaExiste(idTarea);
        if (!tareaExiste) {
            return res.status(404).json({ message: 'La tarea asignada no existe.' });
        }
    
    // Validar que el trabajador asignado exista
        const usuarioExiste = await notificacionesModel.verificarUsuarioExiste(trabajadorAsignado);
        if (!usuarioExiste) {
            return res.status(404).json({ message: 'El trabajador asignado no existe.' });
        }
    
        await notificacionesModel.crearNotificacion(id, idTarea, trabajadorAsignado, estado);
        res.status(201).json({ message: 'Notificación creada exitosamente.' });
    } catch (error) {
        console.error('Error al crear notificación:', error);
        res.status(500).json({ message: 'Error al crear la notificación.', error });
    }
});

//___________________________________________________________________________________________________________________________________
//actualizar

router.put('/notificacion/:id', async (req, res) => {
    const id = req.body.id;
    const idTarea = req.body.idTarea;
    const trabajadorAsignado = req.body.trabajadorAsignado;
    const estado = req.body.estado;

    
    // Validar campos obligatorios
    if (!idTarea || !trabajadorAsignado || !estado) {
        return res.status(400).json({ message: 'Todos los campos (idTarea, trabajadorAsignado, estado) son obligatorios.' });
    }

    // Validar estado de notificación
    const estadosPermitidos = ['creada', 'en proceso', 'terminada'];
    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ message: 'Estado no permitido.' });
    }

    // Validar que la tarea asignada exista
    try {
        const tareaExiste = await notificacionesModel.verificarTareaExiste(idTarea);
        if (!tareaExiste) {
            return res.status(404).json({ message: 'La tarea asignada no existe.' });
        }

        // Validar que el trabajador asignado exista
        const usuarioExiste = await notificacionesModel.verificarUsuarioExiste(trabajadorAsignado);
        if (!usuarioExiste) {
            return res.status(404).json({ message: 'El trabajador asignado no existe.' });
        }

        await notificacionesModel.actualizarNotificacion(id, idTarea, trabajadorAsignado, estado);
        res.json({ message: 'Notificación actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar notificación:', error);
        res.status(500).json({ message: 'Error al actualizar la notificación.', error });
    }
});


//___________________________________________________________________________________________________________________________________
// Eliminar notificación
router.delete('/notificacion/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Verificar si la notificación existe
        const notificacionExistente = await notificacionesModel.traerNotificacion(id);
        if (notificacionExistente.length === 0) {
            return res.status(404).json({ message: 'La notificación no existe.' });
        }

        await notificacionesModel.eliminarNotificacion(id);
        res.json({ message: `Notificación '${id}' eliminada exitosamente.` });
    } catch (error) {
        console.error('Error al eliminar notificación:', error);
        res.status(500).json({ message: 'Error al eliminar la notificación.', error });
    }
});


module.exports = router;
