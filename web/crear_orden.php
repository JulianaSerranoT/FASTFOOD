<?php
session_start();
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'cliente') {
    header("Location: index.html");
    exit();
}

$usuario = $_SESSION['usuario'];
$items = array_filter($_POST['items'], function($cantidad) {
    return $cantidad > 0;
});

if (empty($items)) {
    $_SESSION['mensaje_exito'] = "No has seleccionado ningún producto.";
    header("Location: cliente.php");
    exit();
}

// Preparar los items para la API
$productos = [];
foreach ($items as $idProducto => $cantidad) {
    $productos[] = ['id' => $idProducto, 'cantidad' => $cantidad];
}

// Llamada a la API para crear la orden
$apiUrl = "http://localhost:3002/ordenes";
$data = [
    'usuario' => $usuario,
    'items' => $productos
];
$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
    ],
];
$context  = stream_context_create($options);
$result = file_get_contents($apiUrl, false, $context);

if ($result === FALSE) {
    $_SESSION['mensaje_exito'] = "Error al crear la orden.";
} else {
    $_SESSION['mensaje_exito'] = "¡Orden creada exitosamente!";
}

// Redirigir de vuelta a la página del cliente
header("Location: cliente.php");
exit();
?>
