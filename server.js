const express = require('express');
const app = express();
const mysql = require("mysql");


app.post("/getallapplications", (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.body.username;
    const password = req.query.password;

    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            if (err) throw err;
            let sql = "SELECT ID FROM applications WHERE Moderated='no'";
            con.query(sql, function (err, result) {
                if (err) {
                    res.send({res:"bad", reason: "db"});
                    throw err;
                }
                res.send({res:"good", data: result});
            });
            con.end(function(err) {
                if (err) {
                  return console.log("Ошибка: " + err.message);
                }
            });
        } else {
            res.send({res:"bad", reason: "access"});
        }
    });
});

app.post("/getoneapplication", (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const id = req.body.id;
    const username = req.body.username;
    const password = req.query.password;
    
    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            con.connect(function(err) {
                if (err) throw err;
                let sql = `SELECT FIO, BirthDate, PassportData, RegistrationAdress, LivingAdress, IsMarried, HasChildren, WorkPlace, WorkTimeInMonths, WorkName, Salary, SalaryDocument, AdditionalIncome, AdditionalIncomeDocument, FromAdditionalIncome, HasMoney, MoneyCategory, HowMuchMoney, IncomeLink1, IncomeLink2 FROM applications WHERE ID='${id}'`;
                con.query(sql, function (err, result) {
                    if (err) {
                        res.send({res:"bad", reason: "db"});
                        throw err;
                    }
                    res.send({res:"good", data: result});
                });
            });
            con.end(function(err) {
                if (err) {
                  return console.log("Ошибка: " + err.message);
                }
            });
        } else {
            res.send({res:"bad", reason: "access"});
        }
    });
});

app.put("/addapplication", (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.body.username;
    const password = req.body.password;

    const fio = req.body.fio;
    const birthDate = req.body.birthdate;
    const registrationAdress = req.body.registrationadress;
    const livingAdress = req.body.livingadress;
    const isMarried = req.body.ismarried;
    const hasChildren = req.body.haschildren;
    const workPlace = req.body.workplace;
    const workTimeInMonths = req.body.worktimeinmonths;
    const workName = req.body.workname;
    const salary  = req.body.salary;
    const salaryDocument = req.body.salarydocument;
    const additionalIncome = req.body.additionalincome;
    const additionalIncomeDocument = req.body.additionalincomedocument;
    const fromAdditionalIncome = req.body.fromadditionalincome;
    const hasMoney = req.body.hasMoney;
    const incomeLink1 = req.query.incomelink1;
    const incomeLink2 = req.query.incomelink2;
    const moneyCategory = req.body.moneycategory;
    const howMuchMoney = req.query.howmuchmoney;

    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            con.connect(function(err) {
                if (err) throw err;
                let sql = `INSERT INTO applications (FIO, BirthDate, PassportData, RegistrationAdress, LivingAdress, IsMarried, HasChildren, WorkPlace, WorkTimeInMonths, WorkName, Salary, SalaryDocument, AdditionalIncome, AdditionalIncomeDocument, FromAdditionalIncome, HasMoney, MoneyCategory, HowMuchMoney, Moderated, IncomeLink1, IncomeLink2) VALUES('${fio}', '${birthDate}', '${registrationAdress}', '${livingAdress}', '${isMarried}', '${hasChildren}', '${workPlace}', '${workTimeInMonths}', '${workName}', '${salary}', '${salaryDocument}', '${additionalIncome}', '${additionalIncomeDocument}', '${fromAdditionalIncome}', '${hasMoney}', '${moneyCategory}', '${howMuchMoney}', 'no', '${incomeLink1}', '${incomeLink2}')`;
                con.query(sql, function (err, result) {
                    if (err) {
                        res.send({res:"bad", reason: "db"});
                        throw err;
                    }
                    res.send({res:"good"});
                });
            });
            con.end(function(err) {
                if (err) {
                  return console.log("Ошибка: " + err.message);
                }
            });
        } else {
            res.send({res:"bad", reason: "access"});
        }
    });
});

app.patch("/updateapplication", (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.body.username;
    const password = req.body.password;
    const id = req.body.id;
    const verdict = req.body.verdict;
    const commentary = req.body.commentary;

    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            con.connect(function(err) {
                if (err) throw err;
                let sql = `UPDATE applications SET Moderated='yes', Verdict='${verdict}', Moderator=(SELECT ID from users WHERE username='${username}' AND password='${password}'), Commentary='${commentary}' WHERE ID='${id}'`;
                con.query(sql, function (err, result) {
                    if (err) {
                        res.send({res:"bad", reason: "db"});
                        throw err;
                    }
                    res.send({res:"good"});
                });
            });
            con.end(function(err) {
                if (err) {
                  return console.log("Ошибка: " + err.message);
                }
            });
        } else {
            res.send({res:"bad", reason: "access"});
        }
    });
});

app.post("/login", (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    const username = req.body.username;
    const password = req.body.password;

    var con = getConnection(mysql);

    haveAccess(username, password, con, function(access){
        if (access){
            con.connect(function(err) {
                if (err) throw err;
                let sql = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
                con.query(sql, function (err, result) {
                    if (err) {
                        res.send({res:"bad", reason: "db"});
                        throw err;
                    }                
                    res.send({res:"good", username:username, password: password});
                });
            });
            con.end(function(err) {
                if (err) {
                  return console.log("Ошибка: " + err.message);
                }
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