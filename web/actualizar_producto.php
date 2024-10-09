<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SESSION['rol'] === 'gerente') {
    $id = $_POST['id'];
    $cantidad = $_POST['cantidad'];

    // Datos para enviar a la API
    $data = [
        'cantidad' => $cantidad
    ];

    // Crear el contexto de transmisión correcto para la solicitud HTTP
    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'PUT',
            'content' => json_encode($data),
        ],
    ];

    $context = stream_context_create($options);
    $apiUrl = "http://productos:3003/productos/$id"; // API para actualizar el producto
    $result = file_get_contents($apiUrl, false, $context);

    if ($result) {
        // Mostrar una alerta emergente y redirigir
        echo "<script>
            alert('Cantidad actualizada correctamente.');
            window.location.href = 'jefe.php';
        </script>";
    } else {
        // Mostrar una alerta de error y redirigir
        echo "<script>
            alert('Error al actualizar la cantidad.');
            window.location.href = 'jefe.php';
        </script>";
    }
} else {
    echo "<script>
        alert('Acceso no autorizado.');
        window.location.href = 'index.html';
    </script>";
}
?>
