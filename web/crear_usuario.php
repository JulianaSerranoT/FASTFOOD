<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SESSION['rol'] === 'gerente') {
    $nombre = $_POST['nombre'];
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];
    $rol = $_POST['rol'];

    $data = ['nombre' => $nombre, 'usuario' => $usuario, 'password' => $password, 'rol' => $rol];
    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ],
    ];

    $context  = stream_context_create($options);
    $apiUrl = "http://192.168.100.2:3005/usuarios";
    $result = file_get_contents($apiUrl, false, $context);

    if ($result) {
        echo "<script>
            alert('Usuario creado exitosamente.');
            window.location.href = 'jefe.php';
        </script>";
    } else {
        echo "<script>
            alert('Error al crear usuario.');
            window.location.href = 'jefe.php';
        </script>";
    }
}
?>
