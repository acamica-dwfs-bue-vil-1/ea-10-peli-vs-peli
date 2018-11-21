const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const controladorCompetencias = require('./controladores/controladorCompetencias');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias', controladorCompetencias.buscarCompetencias);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
const puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});