<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SESSION['rol'] === 'gerente') {
    $descripcion = $_POST['descripcion'];
    $usuarioAsignado = $_POST['usuarioAsignado'];
    $prioridad = $_POST['prioridad'];

    $data = [
        'descripcion' => $descripcion, 
        'usuarioAsignado' => $usuarioAsignado, 
        'prioridad' => $prioridad, 
        'estado' => 'creada'
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ],
    ];

    $context  = stream_context_create($options);
    $apiUrl = "http://localhost:3004/tareas";
    $result = file_get_contents($apiUrl, false, $context);

    if ($result) {
        $resultData = json_decode($result, true);
        
        if (isset($resultData['id'])) {
            $idTarea = $resultData['id'];
            
            // Enviar notificación
            $notificacion = [
                'idTarea' => $idTarea,
                'trabajadorAsignado' => $usuarioAsignado,
                'estado' => 'creada'
            ];
            $notificacionOptions = [
                'http' => [
                    'header'  => "Content-type: application/json\r\n",
                    'method'  => 'POST',
                    'content' => json_encode($notificacion),
                ],
            ];

            $notificacionContext  = stream_context_create($notificacionOptions);
            $notificacionUrl = "http://localhost:3001/notificacion";
            $notificacionResult = file_get_contents($notificacionUrl, false, $notificacionContext);

            if ($notificacionResult) {
                echo "<script>
                    alert('Tarea y notificación creadas exitosamente.');
                    window.location.href = 'jefe.php';
                </script>";
            } else {
                echo "<script>
                    alert('Tarea creada, pero no se pudo enviar la notificación.');
                    window.location.href = 'jefe.php';
                </script>";
            }
        } else {
            echo "<script>
                alert('Tarea creada, pero no se pudo obtener el ID.');
                window.location.href = 'jefe.php';
            </script>";
        }
    } else {
        echo "<script>
            alert('Error al crear tarea.');
            window.location.href = 'jefe.php';
        </script>";
    }
}
?>
