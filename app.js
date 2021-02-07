const express = require('express');
const mysql = require("mysql");

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());

//Mysql
const connection = mysql.createConnection({
host:'localhost',
user:'root',
password:'Loska256',
database:'prospectos_db'
});

//Check connection
connection.connect(err => {
    if(err) throw err
    console.log("Conected to a MySql");
});

app.get('/prospects', (req, res) => {
    const sql = 'SELECT * FROM prospectos';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0){
            res.json(results);
        }else{
            res.send('No hay prospectos');
        }
    })
} );




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



