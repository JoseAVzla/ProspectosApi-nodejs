const express = require("express");
const mysql = require("mysql");

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());

//Mysql
const connection = mysql.createConnection({
  host: "us-cdbr-east-03.cleardb.com",
  user: "b267c388befb0a",
  password: "3bad0384",
  database: "heroku_c0be54260a1b1b5"
});

//Check connection
connection.connect(err => {
  if (err) throw err;
  console.log("Conected to a MySql");
});

app.get('/', (req, res) => {
    res.send(Date.now().toString())
})

app.get("/prospects", (req, res) => {
  const sql = "SELECT * FROM prospects";
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
  const sql = `SELECT * FROM prospects where id = ${id}`;
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
  const sql = "INSERT INTO  prospects SET ?";
  const prospectObj = {
    nombre: req.body.nombre,
    apellidop: req.body.apellidop,
    apellidom: req.body.apellidom,
    calle: req.body.calle,
    numero: req.body.numero,
    colonia: req.body.colonia,
    cp: req.body.cp,
    telefono: req.body.telefono,
    rfc: req.body.rfc,
    documentos: req.body.documentos,
    estatus: "E",
    observacion: ""
  };
  connection.query(sql, prospectObj, (err) => {
    if (err) throw err;
    res.send("El cliente se agrego correctamente");
  });
});

app.patch("/update/:id", (req, res) => {
  const { id } = req.params;
  const { estatus, observacion } = req.body;
  const sql = `UPDATE prospectos SET estatus = '${estatus}', observacion = '${observacion}' WHERE id = ${id}`;
  connection.query(sql, err => {
    if (err) throw err;
    res.send('Prospect updated!');
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
