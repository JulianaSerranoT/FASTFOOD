<?php
session_start();
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'gerente') {
    header("Location: index.html");
    exit();
}

// Obtener todas las notificaciones
$apiUrl = "http://notificaciones:3001/notificacion";  // La URL para obtener todas las notificaciones
$notificaciones = json_decode(file_get_contents($apiUrl), true);

// Obtener todos los productos
$apiUrlProductos = "http://productos:3003/productos";
$productos = json_decode(file_get_contents($apiUrlProductos), true);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FASTFOOD - Panel Gerente</title>
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
            max-width: 700px;
            margin: 0 auto;
        }

        h1 {
            color: #2c3e50;
        }

        h2 {
            color: #3498db;
            margin-top: 20px;
        }

        input[type="text"], input[type="password"], select {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        input[type="submit"] {
            background-color: #27ae60;
            color: white;
            padding: 12px 20px;
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

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
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

        canvas {
            max-width: 100%;
            height: 400px; /* Ajustamos la altura para evitar que sea muy pequeña */
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bienvenido Gerente de FASTFOOD, <?php echo $_SESSION['usuario']; ?></h1>
        
        <h2>Crear Usuario</h2>
        <form action="crear_usuario.php" method="POST">
            <input type="text" name="nombre" placeholder="Nombre Completo" required>
            <input type="text" name="usuario" placeholder="Usuario" required>
            <input type="password" name="password" placeholder="Contraseña" required>
            <select name="rol">
                <option value="trabajador">Trabajador</option>
                <option value="gerente">Gerente</option>
            </select>
            <input type="submit" value="Crear Usuario">
        </form>

        <h2>Crear Tarea</h2>
        <form action="crear_tarea.php" method="POST">
            <input type="text" name="descripcion" placeholder="Descripción de la tarea" required>
            <input type="text" name="usuarioAsignado" placeholder="Usuario Asignado" required>
            <select name="prioridad">
                <option value=1>Baja</option>
                <option value=3>Media</option>
                <option value=5>Alta</option>
            </select>
            <input type="submit" value="Crear Tarea">
        </form>

        <h2>Crear producto</h2>
        <form action="crear_producto.php" method="POST">
            <input type="text" name="nombre" placeholder="Nombre del producto" required>
            <input type="text" name="precio" placeholder="Precio" required>
            <input type="text" name="cantidad" placeholder="Cantidad" required>
            <input type="submit" value="Crear producto">
        </form>

        <h2>Listado de Productos</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Actualizar Cantidad</th>
            </tr>
            <?php foreach ($productos as $producto): ?>
            <tr>
                <td><?php echo $producto['id']; ?></td>
                <td><?php echo $producto['nombre']; ?></td>
                <td><?php echo $producto['precio']; ?></td>
                <td><?php echo $producto['cantidad']; ?></td>
                <td>
                    <form action="actualizar_producto.php" method="POST">
                        <input type="hidden" name="id" value="<?php echo $producto['id']; ?>">
                        <input type="text" name="cantidad" placeholder="Nueva cantidad" required>
                        <input type="submit" value="Actualizar">
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </table>

        <h2>Notificaciones</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>ID Tarea</th>
                <th>Trabajador Asignado</th>
                <th>Estado</th>
                <th>Fecha y Hora</th>
            </tr>
            <?php foreach ($notificaciones as $notificacion): ?>
            <tr>
                <td><?php echo $notificacion['id']; ?></td>
                <td><?php echo $notificacion['idTarea']; ?></td>
                <td><?php echo $notificacion['trabajadorAsignado']; ?></td>
                <td><?php echo $notificacion['estado']; ?></td>
                <td><?php echo $notificacion['fechaHora']; ?></td>
            </tr>
            <?php endforeach; ?>
        </table>

        <!-- Gráfica para estadísticas de órdenes y gastos -->
        <h2>Estadísticas de Cantidad de Órdenes</h2>
        <canvas id="cantidadOrdenesChart" width="400" height="200"></canvas>

        <h2>Estadísticas de Total Gastado</h2>
        <canvas id="totalGastadoChart" width="400" height="200"></canvas>

        <a href="logout.php">Cerrar Sesión</a>
        <div class="footer">© 2024 FASTFOOD - Gestión de Tareas</div>
    </div>

    <!-- Incluimos Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0"></script>

    <!-- Script para obtener las estadísticas de la API y mostrar las gráficas -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Realizar una solicitud a la API de estadísticas de órdenes
            fetch('http://192.168.100.2:3006/estadisticas/ordenes')
                .then(response => response.json())
                .then(data => {
                    console.log('Datos recibidos:', data); // Verifica los datos en la consola

                    // Validar si los datos tienen la estructura correcta
                    if (Array.isArray(data) && data.length > 0 && data[0].usuarioCliente) {
                        // Mapeamos los datos para obtener usuarios, cantidad de órdenes y total gastado
                        const usuarios = data.map(item => item.usuarioCliente);
                        const cantidadOrdenes = data.map(item => item.cantidadOrdenes);
                        const totalGastado = data.map(item => item.totalGastado);

                        // Mostrar los datos en la consola para depuración
                        console.log('Usuarios:', usuarios);
                        console.log('Cantidad de órdenes:', cantidadOrdenes);
                        console.log('Total gastado:', totalGastado);

                        // Crear la gráfica para "Cantidad de Órdenes"
                        const ctx1 = document.getElementById('cantidadOrdenesChart').getContext('2d');
                        const chart1 = new Chart(ctx1, {
                            type: 'bar',
                            data: {
                                labels: usuarios, // Nombres de los usuarios en el eje X
                                datasets: [{
                                    label: 'Cantidad de Órdenes',
                                    data: cantidadOrdenes,
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });

                        // Crear la gráfica para "Total Gastado"
                        const ctx2 = document.getElementById('totalGastadoChart').getContext('2d');
                        const chart2 = new Chart(ctx2, {
                            type: 'bar',
                            data: {
                                labels: usuarios, // Nombres de los usuarios en el eje X
                                datasets: [{
                                    label: 'Total Gastado',
                                    data: totalGastado,
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    } else {
                        console.error('La estructura de los datos no es válida.');
                    }
                })
                .catch(error => {
                    console.error('Error al obtener las estadísticas:', error);
                });
        });
    </script>
</body>
</html>
