const express = require('express');
const app = express();
const mysql = require("mysql");


app.get("/getrequest", (req, res)=>{
    var con = mysql.createConnection({
        host: "localhost",
        user: "yourusername",
        password: "yourpassword"
    });
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        sql = "SELECT * FROM requests WHERE Moderated='no'"
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Result: " + result);
        });
      });
});

app.post("/addrequest", (req, res)=>{
    name = req.body.name;

    var con = mysql.createConnection({
        host: "localhost",
        user: "yourusername",
        password: "yourpassword"
    });
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        sql = "INSERT INTO requests () VALUES()"
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Result: " + result);
        });
      });
});

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});