const express = require('express');
const cors = require('cors');
const estadisticasordenesController = require('./controllers/estadisticasordenesController');
const morgan = require('morgan'); 
const app = express();

// Middleware de CORS
app.use(cors());

// Registrar solicitudes con morgan
app.use(morgan('dev'));

// Habilitar el uso de JSON
app.use(express.json());

// Rutas del controlador de estadísticas
app.use(estadisticasordenesController);

app.listen(3006, () => {
  console.log('Microservicio de estadísticas ejecutándose en el puerto 3006');
});
