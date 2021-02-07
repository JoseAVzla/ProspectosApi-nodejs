const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
//Mysql
const connection = mysql.createConnection({
  host: "db-mysql-sfo2-29346-do-user-8686953-0.b.db.ondigitalocean.com",
  user: "doadmin",
  password: "rv3377ryw277zq75",
  database: "defaultdb",
  port: 25060, 
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

