<?php
session_start();
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'cliente') {
    header("Location: index.html");
    exit();
}

$usuario = $_SESSION['usuario'];

// Obtener productos desde la API
$apiUrlProductos = "http://productos:3003/productos";
$productos = json_decode(file_get_contents($apiUrlProductos), true);

// Obtener órdenes del usuario desde la API
$apiUrlOrdenes = "http://ordenes:3002/ordenes/usuario/$usuario";
$ordenes = json_decode(file_get_contents($apiUrlOrdenes), true);

// Verificar si la respuesta de la API es válida
if ($ordenes === null) {
    $ordenesError = "No se pudieron obtener las órdenes del servidor.";
}

// Verificar si se creó una orden con éxito
if (isset($_SESSION['mensaje_exito'])) {
    $mensaje_exito = $_SESSION['mensaje_exito'];
    unset($_SESSION['mensaje_exito']); // Limpiar el mensaje después de mostrarlo
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FASTFOOD - Panel Cliente</title>
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

        h1, h2 {
            color: #3498db;
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

        input[type="number"] {
            width: 50px;
        }

        input[type="submit"] {
            background-color: #27ae60;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #2ecc71;
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
    <script>
        // Mostrar alerta si hay un mensaje de éxito
        window.onload = function() {
            <?php if (isset($mensaje_exito)): ?>
                alert('<?php echo $mensaje_exito; ?>');
            <?php endif; ?>
        };
    </script>
</head>
<body>
    <div class="container">
        <h1>Bienvenido, <?php echo $_SESSION['usuario']; ?></h1>
        
        <h2>Productos Disponibles</h2>
        <form action="crear_orden.php" method="POST">
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad Disponible</th>
                    <th>Cantidad a Comprar</th>
                </tr>
                <?php foreach ($productos as $producto): ?>
                <tr>
                    <td><?php echo $producto['id']; ?></td>
                    <td><?php echo $producto['nombre']; ?></td>
                    <td><?php echo $producto['precio']; ?></td>
                    <td><?php echo $producto['cantidad']; ?></td>
                    <td>
                        <input type="number" name="items[<?php echo $producto['id']; ?>]" min="0" max="<?php echo $producto['cantidad']; ?>" value="0">
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>
            <input type="submit" value="Realizar Orden">
        </form>

        <h2>Mis Órdenes</h2>

        <?php if (isset($ordenesError)): ?>
            <p><?php echo $ordenesError; ?></p>
        <?php elseif (empty($ordenes)): ?>
            <p>No has realizado ninguna orden.</p>
        <?php else: ?>
            <table>
                <tr>
                    <th>ID Orden</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                </tr>
                <?php foreach ($ordenes as $orden): ?>
                    <tr>
                        <td><?php echo isset($orden['id']) ? $orden['id'] : 'N/A'; ?></td>
                        <td><?php echo isset($orden['totalcuenta']) ? $orden['totalcuenta'] : 'N/A'; ?></td>
                        <td><?php echo isset($orden['estado']) ? $orden['estado'] : 'N/A'; ?></td>
                        <td><?php echo isset($orden['fechahora']) ? date('Y-m-d H:i:s', strtotime($orden['fechahora'])) : 'N/A'; ?></td>
                    </tr>
                <?php endforeach; ?>
            </table>
        <?php endif; ?>

        <a href="logout.php">Cerrar Sesión</a>
        <div class="footer">© 2024 TaskMaster - Gestión de Tareas</div>
    </div>
</body>
</html>
