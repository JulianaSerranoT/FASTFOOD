<?php
session_start();
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] !== 'gerente') {
    header("Location: index.html");
    exit();
}

// Ruta relativa a la carpeta de imágenes desde la raíz del servidor web
$imagesDir = 'pyspark/output';

// Obtener todos los archivos PNG de la carpeta
$images = glob($imagesDir . '/*.png');
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de FASTFOOD</title>
    <link href="lightbox/css/lightbox.css" rel="stylesheet" />
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
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            color: #2c3e50;
            text-align: center;
        }

        .image-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }

        .image-grid a img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 2px 2px 12px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }

        .image-grid a img:hover {
            transform: scale(1.05);
        }

        .image-container {
            flex: 1 1 45%;
            max-width: 45%;
        }

        @media (max-width: 768px) {
            .image-container {
                flex: 1 1 100%;
                max-width: 100%;
            }
        }

        .back-button {
            display: inline-block;
            margin-top: 20px;
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
        }

        .back-button:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Dashboard de FASTFOOD</h1>
        
        <div class="image-grid">
            <?php
            if ($images) {
                foreach ($images as $image) {
                    // Obtener el nombre del archivo
                    $imageName = basename($image);
                    echo '<div class="image-container">';
                    echo '<a href="' . htmlspecialchars($image) . '" data-lightbox="dashboard" data-title="' . htmlspecialchars($imageName) . '">';
                    echo '<img src="' . htmlspecialchars($image) . '" alt="' . htmlspecialchars($imageName) . '">';
                    echo '</a>';
                    echo '</div>';
                }
            } else {
                echo '<p>No hay imágenes disponibles en el dashboard.</p>';
            }
            ?>
        </div>

        <a href="jefe.php" class="back-button">Volver al Panel Gerente</a>
    </div>

    <!-- Incluir Lightbox JS -->
    <script src="lightbox/js/lightbox-plus-jquery.js"></script>
</body>
</html>

