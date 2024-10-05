<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    // Llamada a la API de usuarios para validar credenciales
    $apiUrl = "http://localhost:3005/usuarios/$usuario";
    $usuarioData = json_decode(file_get_contents($apiUrl), true);

    if ($usuarioData && $usuarioData['password'] === $password) {
        $_SESSION['usuario'] = $usuarioData['usuario'];
        $_SESSION['rol'] = $usuarioData['rol'];

        // Redirigir según el rol
        if ($usuarioData['rol'] === 'gerente') {
            header("Location: jefe.php");
        } elseif ($usuarioData['rol'] === 'trabajador') {
            header("Location: trabajador.php");
        } elseif ($usuarioData['rol'] === 'cliente'){
            header("Location: cliente.php");
        }else{
            echo "Rol no reconocido.";
        }
    } else {
        echo "Usuario o contraseña incorrectos.";
    }
}
?>