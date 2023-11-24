const express = require('express');
const app = express();
const mysql = require("mysql");


app.post("/getallapplications", (req, res)=>{
    const username = req.body.username;
    const password = req.query.password;

    var con = getConnection(mysql);

    if (haveAccess(username, password, con)){
        con.connect(function(err) {
            if (err) throw err;
            let sql = "SELECT * FROM requests WHERE Moderated='no'";
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }
                res.send({res:"good", data: result});
            });
        });
    } else {
        res.send({res:"bad", reason: "access"});
    }
});

app.post("/getoneapplication", (req, res)=>{
    const id = req.body.id;
    const username = req.body.username;
    const password = req.query.password;
    
    var con = getConnection(mysql);

    if (haveAccess(username, password, con)){
        con.connect(function(err) {
            if (err) throw err;
            let sql = "SELECT * FROM requests WHERE ID='"+id+"'";
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }
                res.send({res:"good", data: result});
            });
        });
    } else {
        res.send({res:"bad", reason: "access"});
    }
});

app.put("/addapplication", (req, res)=>{
    const username = req.body.username;
    const password = req.query.password;

    var con = getConnection(mysql);

    if (haveAccess(username, password, con)){
        con.connect(function(err) {
            if (err) throw err;
            let sql = "INSERT INTO requests () VALUES()";
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }
                res.send({res:"good"});
            });
        });
    } else {
        res.send({res:"bad", reason: "access"});
    }
});

app.patch("/updateapplication", (req, res)=>{
    const username = req.body.username;
    const password = req.query.password;
    const id = req.query.id;
    const verdict = req.query.verdict;

    var con = getConnection(mysql);

    if (haveAccess(username, password, con)){
        con.connect(function(err) {
            if (err) throw err;
            let sql = "UPDATE data SET moderated='yes' AND verdict='"+verdict+"' WHERE ID='"+id+"'";
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }                
                res.send({res:"good"});
            });
        });
    } else {
        res.send({res:"bad", reason: "access"});
    }
});
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});

function haveAccess(username, password, con){
    con.connect(function(err) {
        if (err) throw err;
        sql = "SELECT * FROM users WHERE username='"+username+"' AND password='"+password+"'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length==1){
                return true;
            } else {
                return false;
            }
        });
    });
}
function getConnection(mysql){
    return mysql.createConnection({
        host: "localhost",
        user: "yourusername",
        password: "yourpassword"
    });
}