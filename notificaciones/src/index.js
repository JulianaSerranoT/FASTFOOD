const express = require('express');
const notificacionesController = require('./controllers/notificacionesController');
const morgan = require('morgan'); 
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use(notificacionesController);


app.listen(3001, () => {
  console.log('Microservicio notificaciones ejecutandose en el puerto 3001');
});