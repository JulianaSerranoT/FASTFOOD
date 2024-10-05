<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SESSION['rol'] === 'gerente') {
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $cantidad = $_POST['cantidad'];

    $data = [
        'nombre' => $nombre, 
        'precio' => $precio, 
        'cantidad' => $cantidad
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ],
    ];

    $context  = stream_context_create($options);
    $apiUrl = "http://localhost:3003/productos";
    $result = file_get_contents($apiUrl, false, $context);

    if ($result) {
        echo "<script>
            alert('Producto creado exitosamente.');
            window.location.href = 'jefe.php';
        </script>";
    } else {
        echo "<script>
            alert('Error al crear producto.');
            window.location.href = 'jefe.php';
        </script>";
    }
}
?>
