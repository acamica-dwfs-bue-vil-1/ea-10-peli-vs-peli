const connection = require('../lib/conexionbd');

function buscarCompetencias (req, res) {
  let sql = 'SELECT * FROM competencia;'

  connection.query(sql, function(error, resultado, fields) {
    if (error) {
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    } 
    var response = resultado;
    // var response = {
    //   'competencias': resultado
    // };
    console.log('respuesta: ', response);
    console.log('nombre: ', response[0].nombre);
    res.send(JSON.stringify(response));
  });
}

module.exports = {
  buscarCompetencias: buscarCompetencias
};