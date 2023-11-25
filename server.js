const express = require('express');
const app = express();
const mysql = require("mysql");


app.post("/getallapplications", (req, res)=>{
    const username = req.body.username;
    const password = req.query.password;

    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            let sql = "SELECT * FROM applications WHERE Moderated='no'";
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }                
                res.send({res:"good", data: result});
            });
        } else {
            res.send({res:"bad", reason: "access"});
        }
    });
});

app.post("/getoneapplication", (req, res)=>{
    const id = req.body.id;
    const username = req.body.username;
    const password = req.query.password;
    
    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            let sql = `SELECT * FROM applications WHERE ID='${id}'`;
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }                
                res.send({res:"good", data: result});
            });
        } else {
            res.send({res:"bad", reason: "access"});
        }
    });
});

app.put("/addapplication", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const fio = req.body.fio;
    const registrationAdress = req.body.registrationadress;
    const livingAdress = req.body.livingadress;
    const isMarried = req.body.ismarried;
    const hasChildren = req.body.haschildren;
    const workAdress = req.body.workadress;
    const workTimeInMonths = req.body.worktimeinmonths;
    const workName = req.body.workname;
    const salary  = req.body.salary;
    const salaryDocument = req.body.salarydocument;
    const additionalIncome = req.body.additionalincome;
    const additionalIncomeDocument = req.body.additionalincomedocument;
    const fromAdditionalIncome = req.body.fromadditionalincome;
    const hasMoney = req.body.hasMoney;

    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            let sql = `INSERT INTO applications (FIO, PassportData, RegistrationAdress, LivingAdress, IsMarried, HasChildren, WorkAdress, WorkTimeInMonths, WorkName, Salary, SalaryDocument, AdditionalIncome, AdditionalIncomeDocument, FromAdditionalIncome, HasMoney) VALUES('${fio}', '${registrationAdress}', '${livingAdress}', '${isMarried}', '${hasChildren}', '${workAdress}', '${workTimeInMonths}', '${workName}', '${salary}', '${salaryDocument}', '${additionalIncome}', '${additionalIncomeDocument}', '${fromAdditionalIncome}', '${hasMoney}')`;
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }                
                res.send({res:"good"});
            });
        } else {
            res.send({res:"bad", reason: "access"});
        }
    });
});

app.patch("/updateapplication", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const id = req.body.id;
    const verdict = req.body.verdict;

    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            let sql = `UPDATE applications SET Moderated='yes', Verdict='${verdict}', Moderator=(SELECT ID from users WHERE username='${username}' AND password='${password}') WHERE ID='${id}'`;
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }                
                res.send({res:"good"});
            });
        } else {
            res.send({res:"bad", reason: "access"});
        }
    });
});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            let sql = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }                
                res.send({res:"good", username:username, password: password});
            });
        } else {
            res.send({res:"bad", reason: "access"});
        }
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});

function haveAccess(username, password, con, callback){
    con.connect(function(err) {
        if (err) throw err;
        sql = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length==1){
                callback(true);
            } else {
                callback(false);
            }
        });
    });
}

function getConnection(mysql){
    return mysql.createConnection({
        host: "localhost",
        user: "manager",
        password: "manager123",
        database: "CreditDB"
    });
}