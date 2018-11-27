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
app.get('/competencias/:id/peliculas', controladorCompetencias.buscarOpciones);
app.get('/competencias/:idCompetencia/resultados', controladorCompetencias.buscarResultados);
app.post('/competencias/:idCompetencia/voto', controladorCompetencias.guardarVoto);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
const puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});