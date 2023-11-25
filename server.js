const express = require('express');
const app = express();
const mysql = require("mysql");
var cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.post("/getallapplications", (req, res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;
    
        var con = getConnection(mysql);
    
        haveAccess(username, password, con, function(access){
            if (access){
                con.query("SELECT * FROM applications WHERE Moderated='no'", function (err, result) {
                    if (err) {
                        res.send({res:"bad", reason: "db"});
                        console.log(err);
                    } else {
                        if (result.length!=0){
                            res.send({res:"good", data: result});
                        } else {
                            res.send({res: "bad", reason:"noone"});
                        }
                    }
                });
                con.end();
            } else {
                res.send({res:"bad", reason: "access"});
            }
        });
    } catch (error) {
        console.error(error);
        res.send({res:"bad", reason: "server"});
    }
});


app.post("/getoneapplication", (req, res)=>{
    try {
        const id = req.body.id;
        const username = req.body.username;
        const password = req.body.password;
        
        var con = getConnection();

        haveAccess(username, password, con, function(access){
            if (access){
                let sql = `SELECT FIO, BirthDate, PassportData, RegistrationAdress, LivingAdress, IsMarried, HasChildren, WorkPlace, WorkTimeInMonths, WorkName, Salary, SalaryDocument, AdditionalIncome, AdditionalIncomeDocument, FromAdditionalIncome, HasMoney, MoneyCategory, HowMuchMoney, IncomeLink1, IncomeLink2 FROM applications WHERE ID='${id}'`;
                con.query(sql, function (err, result) {
                    if (err) {
                        res.send({res:"bad", reason: "db"});
                        console.log(err);
                    } else if (result.length != 0){
                        res.send({res:"good", data: result[0]});
                    } else {
                        res.send({res: "bad", reason:"noone"});
                    }
                });
                con.end();
            } else {
                res.send({res:"bad", reason: "access"});
            }
        });
    } catch (error) {
        console.error(error);
        res.send({res:"bad", reason: "server"});
    }
});


app.put("/addapplication", (req, res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;

        const fio = req.body.fio;
        const birthDate = req.body.birthDate;
        const registrationAdress = req.body.registrationAdress;
        const livingAdress = req.body.livingAdress;
        const isMarried = req.body.isMarried;
        const hasChildren = req.body.hasChildren;
        const workPlace = req.body.workPlace;
        const workTimeInMonths = req.body.workTimeInMonths;
        const workName = req.body.workName;
        const salary  = req.body.salary;
        const salaryDocument = req.body.salaryDocument;
        const additionalIncome = req.body.additionalIncome;
        const additionalIncomeDocument = req.body.additionalIncomeDocument;
        const fromAdditionalIncome = req.body.fromAdditionalIncome;
        const hasMoney = req.body.hasMoney;
        const incomeLink1 = req.body.incomeLink1;
        const incomeLink2 = req.body.incomeLink2;
        const moneyCategory = req.body.moneyCategory;
        const howMuchMoney = req.body.howMuchMoney;

        var con = getConnection();
        haveAccess(username, password, con, function(access){
            if (access){
                let sql = "INSERT INTO applications (FIO, BirthDate, RegistrationAdress, LivingAdress, IsMarried, HasChildren, WorkPlace, WorkTimeInMonths, WorkName, Salary, SalaryDocument, AdditionalIncome, AdditionalIncomeDocument, FromAdditionalIncome, HasMoney, MoneyCategory, HowMuchMoney, Moderated, IncomeLink1, IncomeLink2) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                con.query(sql, [fio, birthDate, registrationAdress, livingAdress, isMarried, hasChildren, workPlace, workTimeInMonths, workName, salary, salaryDocument, additionalIncome, additionalIncomeDocument, fromAdditionalIncome, hasMoney, moneyCategory, howMuchMoney, 'no', incomeLink1, incomeLink2], function (err, result) {
                    if (err) {
                        res.send({res:"bad", reason: "db"});
                        console.log(err);
                    } else {
                        res.send({res:"good"});
                    }
                });
                con.end();
            } else {
                res.send({res:"bad", reason: "access"});
            }
        });
    } catch (error) {
                console.error(error);
                res.send({res:"bad", reason: "server"});
    }
});


app.patch("/updateapplication", (req, res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;
        const id = req.body.id;
        const verdict = req.body.verdict;
        const commentary = req.body.commentary;

        var con = getConnection();

        haveAccess(username, password, con, function(access){
            if (access){
                let sql = "UPDATE applications SET Moderated='yes', Verdict=?, Moderator=(SELECT ID from users WHERE username=? AND password=?), Commentary=? WHERE ID=?";
                con.query(sql, [verdict, username, password, commentary, id], function (err, result) {
                    if (err) {
                        res.send({res:"bad", reason: "db"});
                        console.log(err);
                    } else {
                        res.send({res:"good", result: result});
                    }
                });
                con.end();
            } else {
                res.send({res:"bad", reason: "access"});
            }
        });
    } catch (error) {
        console.error(error);
        res.send({res:"bad", reason: "server"});
    }
});

app.post("/login", (req, res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;
    
        var con = getConnection(mysql);
    
        haveAccess(username, password, con, function(access){
            if (access){
                con.query('SELECT * FROM users WHERE username=? AND password=?', [username, password], function (err, result) {
                    if (err) {
                        res.send({res:"bad", reason: "db"});
                        console.log(err);
                    } else {
                        res.send({res:"good", username:username, password: password});
                    }
                });
                con.end();
            } else {
                res.send({res:"bad", reason: "access"});
            }
        });
    } catch (error) {
        console.error(error);
        res.send({res:"bad", reason: "server"});
    }

});

const port = 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

function haveAccess(username, password, con, callback){
    con.connect(function(err) {
        if (err) console.log(err);
        sql = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
        con.query(sql, function (err, result) {
            if (err) console.log(err);
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