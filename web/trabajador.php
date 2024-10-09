<?php
session_start();
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'trabajador') {
    header("Location: index.html");
    exit();
}

$usuario = $_SESSION['usuario'];

// Obtener tareas del trabajador desde la API
$apiUrlTareas = "http://tareas:3004/tareas/usuario/$usuario";
$tareas = json_decode(file_get_contents($apiUrlTareas), true);

// Obtener órdenes desde la API
$apiUrlOrdenes = "http://ordenes:3002/ordenes"; // Cambia la URL si es necesario
$ordenes = json_decode(file_get_contents($apiUrlOrdenes), true);

// Verificar si hay errores al obtener datos de las APIs
if ($tareas === null) {
    $tareasError = "No se pudieron obtener las tareas del servidor.";
}
if ($ordenes === null) {
    $ordenesError = "No se pudieron obtener las órdenes del servidor.";
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskMaster - Panel Trabajador</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f8ff;
            color: #333;
            padding: 20px;
        }

        .container {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
            padding: 30px;
            max-width: 900px;
            margin: 0 auto;
        }

        h1 {
            color: #3498db;
        }

        h2 {
            margin-top: 40px;
            color: #2ecc71;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        table, th, td {
            border: 1px solid #ddd;
        }

        th, td {
            padding: 15px;
            text-align: left;
        }

        th {
            background-color: #3498db;
            color: white;
        }

        input[type="submit"] {
            background-color: #e67e22;
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #d35400;
        }

        select {
            padding: 8px;
        }

        .footer {
            margin-top: 20px;
            color: #555;
            text-align: center;
            font-size: 12px;
        }

        a {
            background-color: #FF0000;
            color: white;
            padding: 7px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Tabla de Tareas -->
        <h1>Tareas Asignadas</h1>

        <?php if (isset($tareasError)): ?>
            <p><?php echo $tareasError; ?></p>
        <?php elseif (empty($tareas)): ?>
            <p>No tienes tareas asignadas.</p>
        <?php else: ?>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Acción</th>
                </tr>
                <?php foreach ($tareas as $tarea): ?>
                <tr>
                    <td><?php echo $tarea['id']; ?></td>
                    <td><?php echo $tarea['descripcion']; ?></td>
                    <td><?php echo $tarea['estado']; ?></td>
                    <td><?php echo $tarea['prioridad']; ?></td>
                    <td>
                        <form action="actualizar_tarea.php" method="POST">
                            <input type="hidden" name="idTarea" value="<?php echo $tarea['id']; ?>">
                            <input type="hidden" name="descripcion" value="<?php echo $tarea['descripcion']; ?>">
                            <input type="hidden" name="usuarioAsignado" value="<?php echo $tarea['usuarioAsignado']; ?>">
                            <input type="hidden" name="prioridad" value="<?php echo $tarea['prioridad']; ?>">

                            <select name="estado">
                                <option value="en proceso" <?php if ($tarea['estado'] === 'en proceso') echo 'selected'; ?>>En proceso</option>
                                <option value="terminada" <?php if ($tarea['estado'] === 'terminada') echo 'selected'; ?>>Terminada</option>
                            </select>
                            <input type="submit" value="Actualizar">
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>
        <?php endif; ?>

        <!-- Tabla de Órdenes -->
        <h2>Órdenes Recibidas</h2>

        <?php if (isset($ordenesError)): ?>
            <p><?php echo $ordenesError; ?></p>
        <?php elseif (empty($ordenes)): ?>
            <p>No hay órdenes registradas.</p>
        <?php else: ?>
            <table>
                <tr>
                    <th>ID Orden</th>
                    <th>Nombre Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Actualizar Estado</th>
                </tr>
                <?php foreach ($ordenes as $orden): ?>
                <tr>
                    <td><?php echo $orden['id']; ?></td>
                    <td><?php echo $orden['nombreCliente']; ?></td>
                    <td><?php echo $orden['totalcuenta']; ?></td>
                    <td><?php echo $orden['estado']; ?></td>
                    <td>
                        <form action="actualizar_orden.php" method="POST">
                            <input type="hidden" name="id" value="<?php echo $orden['id']; ?>">
                            <select name="estado">
                                <option value="en preparacion" <?php if ($orden['estado'] === 'en preparacion') echo 'selected'; ?>>En preparación</option>
                                <option value="entregada" <?php if ($orden['estado'] === 'entregada') echo 'selected'; ?>>Entregada</option>
                            </select>
                            <input type="submit" value="Actualizar Estado">
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>
        <?php endif; ?>

        <a href="logout.php">Cerrar Sesión</a>
        <div class="footer">© 2024 TaskMaster - Gestión de Órdenes y Tareas</div>
    </div>
</body>
</html>
