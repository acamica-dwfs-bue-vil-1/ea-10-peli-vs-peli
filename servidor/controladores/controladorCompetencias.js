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

function buscarCompetencia (req, res) {
  let idCompetencia = req.params.idCompetencia;
  let sql = `SELECT * FROM competencia WHERE id=${idCompetencia};`;

  connection.query(sql, function(error, resultado, fields) {
    if (error || resultado.length == 0) {
        return res.status(404).send("No se encontró la competencia");
    }
    res.send(JSON.stringify(resultado[0]));
  });
}

function buscarOpciones (req, res) {
  let idCompetencia = req.params.id;
  let sql = `SELECT nombre, genero_id, director_id, actor_id FROM competencia WHERE id=${idCompetencia};`;
  let nombreCompetencia, filtros, columnas, tablas, condiciones, competencia, sql_;
  

  connection.query(sql, function(error, resultado, fields) {
    if (error) {
        return res.status(404).send("No se encontró la competencia");
    }
    filtros = resultado[0];
    nombreCompetencia = resultado[0].nombre;  
    
    sql_ = `SELECT * FROM pelicula ORDER BY RAND() limit 2;`;

    if (filtros.genero_id != undefined) {
      tablas = `JOIN genero g ON p.genero_id = g.id`;
      condiciones = `g.id = ${filtros.genero_id}`
      if (filtros.director_id != undefined) {
        tablas += ` JOIN director d ON p.director = d.nombre`;
        condiciones += ` AND d.id = ${filtros.director_id}`;
      }
      if (filtros.actor_id != undefined) {
        tablas += ` JOIN actor_pelicula ap ON p.id = ap.pelicula_id`;
        condiciones += ` AND ap.actor_id = ${filtros.actor_id}`;
      }
    }
    if (filtros.director_id != undefined && filtros.genero_id == undefined) {
      tablas = `JOIN director d ON p.director = d.nombre`;
      condiciones = `d.id = ${filtros.director_id}`;
      if (filtros.actor_id != undefined) {
        tablas += ` JOIN actor_pelicula ap ON p.id = ap.pelicula_id`;
        condiciones += ` AND ap.actor_id = ${filtros.actor_id}`;
      }
    }
    if (filtros.actor_id != undefined && filtros.genero_id == undefined && filtros.director_id == undefined) {
      tablas = `JOIN actor_pelicula ap ON p.id = ap.pelicula_id`;
      condiciones = `ap.actor_id = ${filtros.actor_id}`;
    }
    sql_ = `SELECT p.* FROM pelicula p ${tablas} WHERE ${condiciones} ORDER BY RAND() limit 2;`;                     
    console.log(sql_);
    connection.query(sql_, function(error_, resultado_, fields_) {
      if (error_) {
          return res.status(404).send("No se encontró la competencia");
      }
      let response = {
        'competencia': nombreCompetencia,
        'peliculas': resultado_
      };
    res.send(JSON.stringify(response));
    });
  });
}

function buscarGeneros (req, res) {
  let sql = `SELECT nombre, id FROM genero`;
  connection.query(sql, function(error, resultado, fields) {
    if (error) {
      return res.status(404).send("Hubo un error en la consulta");
    }
    res.send(JSON.stringify(resultado));
  });
}

function buscarDirectores (req, res) {
  let sql = `SELECT nombre, id FROM director`;
  connection.query(sql, function(error, resultado, fields) {
    if (error) {
      return res.status(404).send("Hubo un error en la consulta");
    }
    res.send(JSON.stringify(resultado));
  });
}

function buscarActores (req, res) {
  let sql = `SELECT nombre, id FROM actor`;
  connection.query(sql, function(error, resultado, fields) {
    if (error) {
      return res.status(404).send("Hubo un error en la consulta");
    }
    res.send(JSON.stringify(resultado));
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

function guardarCompetencia (req, res) {
  let nombreCompetencia = req.body.nombre;
  let generoCompetencia = req.body.genero;
  let directorCompetencia = req.body.director;
  let actorCompetencia = req.body.actor;
  console.log(nombreCompetencia, generoCompetencia, directorCompetencia, actorCompetencia);
  let sql = `INSERT INTO competencia (nombre) VALUES ('${nombreCompetencia}');`;
  connection.query(sql, function(error, resultado, fields) {
    if (error) {
      return res.status(500).send("Hubo un error en el servidor");
    }
    if (generoCompetencia != 0) {
      let sqlGenero = `UPDATE competencia SET genero_id = ${generoCompetencia} WHERE nombre = '${nombreCompetencia}';`;
      connection.query(sqlGenero, function(errorGenero, resultadoGenero, fieldsGenero) {
        if (errorGenero) {
          return res.status(500).send("Hubo un error en el servidor");
        }
      });
    }    
    if (directorCompetencia != 0) {
      let sqlDirector = `UPDATE competencia SET director_id = ${directorCompetencia} WHERE nombre = '${nombreCompetencia}';`;
      connection.query(sqlDirector, function(errorDirector, resultadoDirector, fieldsDirector) {
        if (errorDirector) {
          return res.status(500).send("Hubo un error en el servidor");
        }
      });      
    }
    if (actorCompetencia != 0) {
      let sqlActor = `UPDATE competencia SET actor_id = ${actorCompetencia} WHERE nombre = '${nombreCompetencia}';`;
      connection.query(sqlActor, function(errorActor, resultadoActor, fieldsActor) {
        if (errorActor) {
          return res.status(500).send("Hubo un error en el servidor");
        }
      });      
    }
    res.sendStatus(200); 
  });
  
}

function reiniciarCompetencia (req, res) {
  let idCompetencia = req.params.idCompetencia;
  let sql = `DELETE FROM competencia_pelicula WHERE competencia_id = ${idCompetencia};`;
  let sql_ = `SELECT * FROM competencia WHERE id = ${idCompetencia};`

  connection.query(sql_, function(error_, resultado_, fields_) {
    if (resultado_ == 0) {
      return res.status(404).send("No existe la competencia seleccionada.");
    }else{
      connection.query(sql, function(error, resultado, fields) {
        if (error) {
          return res.status(500).send("Hubo un error en el servidor");
        }
        res.sendStatus(200); 
      });
    }
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
  buscarCompetencia: buscarCompetencia,
  buscarOpciones: buscarOpciones,
  buscarGeneros: buscarGeneros,
  buscarDirectores: buscarDirectores,
  buscarActores: buscarActores,
  guardarVoto: guardarVoto,
  buscarResultados: buscarResultados,
  guardarCompetencia: guardarCompetencia,
  reiniciarCompetencia: reiniciarCompetencia
};

