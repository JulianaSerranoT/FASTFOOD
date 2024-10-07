<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SESSION['rol'] === 'trabajador') {
    $idTarea = $_POST['idTarea'];  // ID de la tarea
    $descripcion = $_POST['descripcion'];
    $usuarioAsignado = $_POST['usuarioAsignado']; // Este campo se usa en la API de notificación como trabajadorAsignado
    $estado = $_POST['estado'];
    $prioridad = $_POST['prioridad'];
    $fechaHora = date('Y-m-d H:i:s');

    // Validar que todos los campos requeridos están presentes
    if (empty($idTarea) || empty($descripcion) || empty($usuarioAsignado) || empty($estado) || empty($prioridad)) {
        echo "<script>
            alert('Error: Faltan datos requeridos.');
            window.location.href = 'trabajador.php';
        </script>";
        exit();
    }

    // Crear el cuerpo de datos para la solicitud PUT
    $data = [
        'id' => $idTarea,  // Asegurarse de incluir el ID en los datos
        'descripcion' => $descripcion,
        'usuarioAsignado' => $usuarioAsignado,
        'estado' => $estado,
        'prioridad' => $prioridad
    ];

    // Opciones para la solicitud PUT
    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'PUT',
            'content' => json_encode($data),  // Convertir los datos a JSON
        ],
    ];

    // Enviar la solicitud PUT
    $context  = stream_context_create($options);
    $apiUrl = "http://192.168.100.2:3004/tareas/$idTarea";  // URL con el ID de la tarea
    $result = @file_get_contents($apiUrl, false, $context);

    if ($result !== FALSE) {
        echo "<script>
            alert('Tarea actualizada exitosamente.');
            window.location.href = 'trabajador.php';
        </script>";

        // Crear notificación de cambio de estado
        $notificacion = [
            'idTarea' => $idTarea,
            'trabajadorAsignado' => $usuarioAsignado, // Ajustado para coincidir con el controlador
            'estado' => $estado,
            'fechaHora' => $fechaHora
        ];

        // Opciones para la solicitud POST de notificación
        $notificacionOptions = [
            'http' => [
                'header'  => "Content-type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($notificacion),  // Convertir notificación a JSON
            ],
        ];

        // Enviar la solicitud POST de notificación
        $notificacionContext = stream_context_create($notificacionOptions);
        $notificacionUrl = "http://192.168.100.2:3001/notificacion";
        $notificacionResult = @file_get_contents($notificacionUrl, false, $notificacionContext);

        // Depurar el resultado de la solicitud de notificación
        if ($notificacionResult !== FALSE) {
            echo "<script>
                alert('Notificación enviada exitosamente.');
                window.location.href = 'trabajador.php';
            </script>";
        } else {
            // Mostrar el error con detalles si falla
            $error = error_get_last();
            echo "<script>
                alert('Error al enviar la notificación. Detalles: " . $error['message'] . "');
                window.location.href = 'trabajador.php';
            </script>";
        }

    } else {
        echo "<script>
            alert('Error al actualizar tarea.');
            window.location.href = 'trabajador.php';
        </script>";
    }
}
?>
