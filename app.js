const express = require("express");
const mysql = require("mysql");

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());

//Mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Loska256",
  database: "prospectos_db"
});

//Check connection
connection.connect(err => {
  if (err) throw err;
  console.log("Conected to a MySql");
});

app.get("/prospects", (req, res) => {
  const sql = "SELECT * FROM prospectos";
  connection.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send("No hay prospectos");
    }
  });
});

app.get("/prospects/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM prospectos where id_prospecto = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.json(result);
    } else {
      res.send(`No hay prospecto con id ${id}`);
    }
  });
});

app.post("/add", (req, res) => {
  const { id } = req.params;
  const sql = "INSERT INTO  prospectos SET ?";
  const prospectObj = {
    nombre: req.body.nombre,
    pri_apellido: req.body.pri_apellido,
    seg_apellido: req.body.seg_apellido,
    direccion_calle: req.body.direccion_calle,
    direccion_numero: req.body.direccion_numero,
    direccion_colonia: req.body.direccion_colonia,
    dirccion_cp: req.body.dirccion_cp,
    telefono: req.body.telefono,
    rfc: req.body.rfc,
    estatus: "ENVIADO",
    observaciones: ""
  };
  connection.query(sql, prospectObj, (err, result) => {
    if (err) throw err;
    res.send("El cliente se agrego correctamente");
  });
});

app.patch("/update/:id", (req, res) => {
  const { id } = req.params;
  const { estatus, observaciones } = req.body;
  const sql = `UPDATE prospectos SET estatus = '${estatus}', observaciones = '${observaciones}' WHERE id_prospecto = ${id}`;
  connection.query(sql, err => {
    if (err) throw err;
    res.send('Prospect updated!');
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
