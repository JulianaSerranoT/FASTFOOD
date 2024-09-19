const express = require('express');
const tareasController = require('./controllers/tareasController');
const morgan = require('morgan'); 
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use(tareasController);


app.listen(3004, () => {
  console.log('Microservicio Tareas ejecutandose en el puerto 3004');
});