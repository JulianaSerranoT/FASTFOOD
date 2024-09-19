const express = require('express');
const ordenesController = require('./controllers/ordenesController');
const morgan = require('morgan'); 
const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use(ordenesController);

app.listen(3002, () => {
  console.log('Microservicio de ordenes escuchando en el puerto 3002');
});