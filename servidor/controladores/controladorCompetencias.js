const connection = require('../lib/conexionbd');

function buscarCompetencias (req, res) {
  let sql = 'SELECT * FROM competencia;'

  connection.query(sql, function(error, resultado, fields) {
    if (error) {
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    } 
    res.send(JSON.stringify(resultado));
  });
}

function buscarOpciones (req, res) {
  let id = req.params.id;
  let tabla, columnas, competencia, sql, sql_;

  switch (id) {
    case '1':
      tabla = `pelicula`;
      columnas = `*`;
      competencia = `puntuacion > 7`;
      break;
    case '2':
      tabla = `pelicula p INNER JOIN genero g ON p.genero_id = g.id`; 
      columnas = `p.id, p.poster, p.titulo`;            
      competencia = `g.nombre = "Terror"`;
      break;
    case '3':
      tabla = `pelicula p INNER JOIN genero g ON p.genero_id = g.id`; 
      columnas = `p.id, p.poster, p.titulo`;                  
      competencia = `g.nombre = "Comedias" AND p.puntuacion < 5`;
      break;
    
    default:
      break;
  }
  
  sql = `SELECT ${columnas} FROM ${tabla} WHERE ${competencia} ORDER BY RAND() limit 2;`;  
  sql_ = `SELECT nombre FROM competencia WHERE id = ${id};`;  
 
  console.log(sql);
  connection.query(sql, function(error, resultado, fields) {
    if (error || resultado.length < 2) {
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    } 

    connection.query(sql_, function(error_, resultado_, fields_) {
      if (error_ || resultado_.length == 0) {
        console.log("Hubo un error en la consulta", error_.message);
        return res.status(404).send("Hubo un error en la consulta");       
      }
      let nombreCompetencia = resultado_[0].nombre;
      console.log(nombreCompetencia);
      console.log(resultado);
      
      let response = {
        'competencia': nombreCompetencia,
        'peliculas': resultado
      };
      res.send(JSON.stringify(response));    
    });
  });
}

function guardarVoto (req, res) {
  let idCompetencia = req.params.idCompetencia;
  let idPelicula = parseInt(req.body.idPelicula);
  console.log(req.body);
  
  let sql = `INSERT INTO competencia_pelicula (competencia_id, pelicula_id) VALUES (${idCompetencia}, ${idPelicula});`;
  connection.query(sql, function(error, resultado, fields) {
    res.json(resultado);
  });
}

function buscarResultados (req, res) {
  let idCompetencia = req.params.idCompetencia;
  let sql = `SELECT cp.pelicula_id, p.poster, p.titulo, COUNT(*) AS votos FROM competencia_pelicula cp JOIN pelicula p ON pelicula_id = p.id WHERE cp.competencia_id = ${idCompetencia} GROUP BY cp.pelicula_id, p.poster ORDER BY votos DESC LIMIT 3;`; 
  let sql_ = `SELECT c.nombre as nombre FROM competencia_pelicula cp JOIN competencia c ON competencia_id = c.id WHERE cp.competencia_id = ${idCompetencia};`;

  connection.query(sql_, function(error_, resultado_, fields_) {
    if (error_) {
      console.log("Hubo un error en la consulta", error_.message);
      return res.status(404).send("Hubo un error en la consulta");
    } else if (resultado_.length == 0) {
      return res.status(404).send("No hay películas votadas para esta competencia.");
    }
    
    let nombreCompetencia = resultado_[0].nombre;
  
    connection.query(sql, function(error, resultado, fields) {
      if (error) {
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
      } 
    let response = {
      'competencia': nombreCompetencia,
      'resultados': resultado
    };
      res.send(JSON.stringify(response));  
    });
  });
}

module.exports = {
  buscarCompetencias: buscarCompetencias,
  buscarOpciones: buscarOpciones,
  guardarVoto: guardarVoto,
  buscarResultados: buscarResultados
};

