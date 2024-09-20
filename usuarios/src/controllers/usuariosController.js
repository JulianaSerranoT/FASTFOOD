const { Router } = require('express');
const router = Router();
const usuariosModel = require('../models/usuariosModel');

//listar usuaurios
router.get('/usuarios', async (req, res) => {
    var result;
    result = await usuariosModel.traerUsuarios() ;
    res.json(result);
});

//___________________________________________________________________________________________________________________________________
//obtener usuaurio por id

router.get('/usuarios/:usuario', async (req, res) => {
    // Extrae el parámetro dinámico 'usuario' de la URL
    const usuario = req.params.usuario;

    // Log para verificar que el parámetro 'usuario' se ha recibido correctamente
    console.log('Usuario recibido en el controlador:', usuario);  

    try {
        // Llama al modelo para traer los datos del usuario con el nombre de usuario proporcionado
        const result = await usuariosModel.traerUsuario(usuario);

        // Verifica si se encontró un usuario con ese nombre de usuario
        if (result.length > 0) {
            // Si se encontró, envía el primer usuario en el arreglo de resultados como respuesta en formato JSON
            res.json(result[0]);
        } else {
            // Si no se encontró ningún usuario, envía un mensaje con estado 404 (no encontrado)
            res.status(404).json({ message: 'No se encontró el usuario con ese nombre.' });
        }
    } catch (error) {
        // Si hay un error al buscar el usuario, lo registra en la consola y envía un mensaje de error al cliente
        console.error('Error en el controlador:', error);
        res.status(500).json({ message: 'Error al buscar el usuario.', error });
    }
});

//___________________________________________________________________________________________________________________________________
//obtener usuario por rol

router.get('/usuarios/rol/:rol', async (req, res) => {
    const rol = req.params.rol;

    console.log('Rol recibido en el controlador:', rol);  // Verifica el valor de rol
    
    try {
        const usuarios = await usuariosModel.traerUsuarioRol(rol);

        if (usuarios.length > 0) {
            res.json(usuarios);
        } else {
            res.status(404).json({ message: 'No se encontraron usuarios con ese rol.' });
        }
    } catch (error) {
        console.error('Error en el controlador:', error);
        res.status(500).json({ message: 'Error al buscar usuarios.', error });
    }
});

//___________________________________________________________________________________________________________________________________
//validar usuaurio y contraseña

router.get('/usuarios/validar/:usuario/:password', async (req, res) => {
    // Extrae los parámetros dinámicos 'usuario' y 'password' de la URL
    const usuario = req.params.usuario;
    const password = req.params.password;

    // Log para verificar que el usuario y la contraseña se recibieron correctamente
    console.log('Usuario recibido en el controlador:', usuario);
    console.log('Contraseña recibida en el controlador:', password);

    // Validación de campos obligatorios
    if (!usuario || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son obligatorios.' });
    }

    try {
        // Llama al modelo para validar el usuario con su contraseña
        const result = await usuariosModel.validarUsuario(usuario, password);

        // Verifica si se encontró un usuario con ese nombre y contraseña
        if (result.length > 0) {
            // Si la validación es correcta, envía los datos del usuario
            res.json({ message: 'Usuario validado exitosamente', usuario: result[0] });
        } else {
            // Si no se encontró o la contraseña no coincide, envía un mensaje indicando el fallo
            res.status(401).json({ message: 'Usuario y contraseña no coinciden' });
        }
    } catch (error) {
        // Si ocurre un error en la validación, lo registra en la consola y envía un mensaje de error
        console.error('Error en el controlador:', error);
        res.status(500).json({ message: 'Error al validar el usuario', error });
    }
});

//___________________________________________________________________________________________________________________________________
// crear

router.post('/usuarios', async (req, res) => {
    const nombre = req.body.nombre;
    const usuario = req.body.usuario;
    const password = req.body.password;
    const rol = req.body.rol;

    // Validación de campos obligatorios
    if (!nombre || !usuario || !password || !rol) {
        return res.status(400).json({ message: 'Todos los campos (nombre, usuario, password, rol) son obligatorios.' });
    }

    // Validar que el rol sea válido
    const rolesPermitidos = ['gerente', 'trabajador', "cliente"];
    if (!rolesPermitidos.includes(rol)) {
        console.log('Rol no permitido:', rol); // Log para rol no permitido
        return res.status(400).send('Rol no permitido');
    }
    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await usuariosModel.traerUsuario(usuario);
        if (usuarioExistente.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        // Crear nuevo usuario
        await usuariosModel.crearUsuario(nombre, usuario, password, rol);
        res.status(201).json({ message: 'Usuario creado exitosamente.' });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error al crear el usuario.', error });
    }
});

//___________________________________________________________________________________________________________________________________
//actualizar usuario

router.put('/usuarios/:usuario', async (req, res) => {
    const usuario = req.body.usuario;
    const nombre = req.body.nombre;
    const password = req.body.password;
    const rol = req.body.rol;
    
    const rolesPermitidos = ['gerente', 'trabajador'];

    // Validación de campos obligatorios
    if (!nombre || !usuario || !password || !rol) {
        return res.status(400).json({ message: 'Todos los campos (nombre, usuario, password, rol) son obligatorios.' });
    }

    // Validación de rol permitido
    if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({ message: 'Rol no permitido.' });
    }

    var result = await usuariosModel.actualizarUsuario(nombre,usuario, password, rol);
    res.send("Usuario actualizado");
});

//___________________________________________________________________________________________________________________________________
//eliminar usuario

router.delete('/usuarios/:usuario', async (req, res) => {
    // Extrae el parámetro dinámico 'usuario' de la URL
    const usuario = req.params.usuario;

    // Log para verificar el usuario que se desea eliminar
    console.log('Usuario recibido para eliminar:', usuario);

    try {
        // Llama al modelo para eliminar el usuario
        const result = await usuariosModel.eliminarUsuario(usuario);

        // Verifica si el usuario existía y fue eliminado (por lo general, result.affectedRows > 0 indica que se eliminó un registro)
        if (result.affectedRows > 0) {
            // Si el usuario fue eliminado correctamente
            res.json({ message: `Usuario '${usuario}' eliminado exitosamente` });
        } else {
            // Si el usuario no existe en la base de datos
            res.status(404).json({ message: `El usuario '${usuario}' que desea eliminar no existe` });
        }
    } catch (error) {
        // Si ocurre un error durante la eliminación
        console.error('Error en el controlador:', error);
        res.status(500).json({ message: 'Error al intentar eliminar el usuario', error });
    }
});

module.exports = router;