<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id']; // ID de la orden que quieres actualizar
    $estado = $_POST['estado']; // Estado actualizado de la orden
    
    // Validar el estado antes de enviar la solicitud
    $estadosValidos = ['creada', 'en preparacion', 'entregada'];
    if (!in_array($estado, $estadosValidos)) {
        echo "Estado inválido";
        exit;
    }

    // Datos que vas a enviar en el PUT
    $data = array('estado' => $estado);
    $data_json = json_encode($data);

    // URL de la API
    $url = "http://ordenes:3002/ordenes/actualizar/" . $id;

    // Configuración del contexto para la solicitud PUT
    $options = array(
        'http' => array(
            'header'  => "Content-Type: application/json\r\n",
            'method'  => 'PUT',
            'content' => $data_json,
        ),
    );

    // Enviar la solicitud PUT
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) {
        echo "Error al actualizar el estado de la orden.";
    } else {
        echo "Estado de la orden actualizado exitosamente.";
    }
}
?>

