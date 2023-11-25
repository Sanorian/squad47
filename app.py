from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Union
from pydantic import BaseModel
from mysql.connector import connect, Error

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    username: str
    password: str
    id: Union[str, None] = None
    commentary: Union[str, None] = None
    verdict: Union[str, None] = None

class Item2(BaseModel):
    username: str
    password: str
    fio: Union[str, None] = None
    birthDate: Union[str, None] = None
    registrationAdress: Union[str, None] = None
    livingAdress: Union[str, None] = None
    isMarried: Union[str, None] = None
    hasChildren: Union[str, None] = None
    workPlace: Union[str, None] = None
    workTimeInMonths: Union[str, None] = None
    workName: Union[str, None] = None
    salary: Union[str, None] = None
    salaryDocument: Union[str, None] = None
    additionalIncome: Union[str, None] = None
    additionalIncomeDocument: Union[str, None] = None
    fromAdditionalIncome: Union[str, None] = None
    hasMoney: Union[str, None] = None
    incomeLink1: Union[str, None] = None
    incomeLink2: Union[str, None] = None
    moneyCategory: Union[str, None] = None
    howMuchMoney: Union[str, None] = None

@app.post("/login")
def getallapplications(item: Item):
    try:
        with connect(
            host="localhost",
            user="manager",
            password="manager123",
            database="CreditDB"
        ) as connection:
            query = "SELECT * FROM users WHERE username='"+item.username+"' AND password='"+item.password+"'"
            with connection.cursor() as cursor:
                cursor.execute(query)
                postData = cursor.fetchone()
                if postData == None:
                    return {"res": "bad", "reason": "access"}
                return {"res":"good", "username": item.username, "password":item.password}
    except Error as e:
        print(e)
        return {"res": "bad", "reason": "db"}

@app.post('/getallposts')
def getallapplications(item: Item):
    try:
        with connect(
            host="localhost",
            user="manager",
            password="manager123",
            database="CreditDB"
        ) as connection:
            query = "SELECT * FROM users WHERE username='"+item.username+"' AND password='"+item.password+"'"
            with connection.cursor() as cursor:
                cursor.execute(query)
                postData = cursor.fetchone()
                if postData == None:
                    return {"res": "bad", "reason": "access"}
                query1 = "SELECT * FROM applications WHERE Moderated='no'"
                cursor.execute(query1)
                return {"res":"good", "result": cursor.fetchall()}
    except Error as e:
        print(e)
        return {"res": "bad", "reason": "db"}

@app.post('/getoneapplication')
def getoneapplication(item: Item):
    try:
        with connect(
            host="localhost",
            user="manager",
            password="manager123",
            database="CreditDB"
        ) as connection:
            query = "SELECT * FROM users WHERE username='"+item.username+"' AND password='"+item.password+"'"
            with connection.cursor() as cursor:
                cursor.execute(query)
                postData = cursor.fetchone()
                if postData == None:
                    return {"res": "bad", "reason": "access"}
                query1 = "SELECT * FROM applications WHERE ID='"+item.id+"'"
                cursor.execute(query1)
                return {"res":"good", "result": cursor.fetchone()}
    except Error as e:
        print(e)
        return {"res": "bad", "reason": "db"}
    
@app.post('/addapplication')
def getallapplications(item: Item2):
    try:
        with connect(
            host="localhost",
            user="manager",
            password="manager123",
            database="CreditDB"
        ) as connection:
            query = "SELECT * FROM users WHERE username='"+item.username+"' AND password='"+item.password+"'"
            with connection.cursor() as cursor:
                cursor.execute(query)
                postData = cursor.fetchone()
                if postData == None:
                    return {"res": "bad", "reason": "access"}
                query1 = "INSERT INTO applications (FIO, BirthDate, RegistrationAdress, LivingAdress, IsMarried, HasChildren, WorkPlace, WorkTimeInMonths, WorkName, Salary, SalaryDocument, AdditionalIncome, AdditionalIncomeDocument, FromAdditionalIncome, HasMoney, MoneyCategory, HowMuchMoney, Moderated, IncomeLink1, IncomeLink2) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                cursor.execute(query1, [item.fio, item.birthDate, item.registrationAdress, item.livingAdress, item.isMarried, item.hasChildren, item.workPlace, item.workTimeInMonths, item.workName, item.salary, item.salaryDocument, item.additionalIncome, item.additionalIncomeDocument, item.fromAdditionalIncome, item.hasMoney, item.moneyCategory, item.howMuchMoney, 'no', item.incomeLink1, item.incomeLink2])
                return {"res":"good"}
    except Error as e:
        print(e)
        return {"res": "bad", "reason": "db"}
    
@app.post('/updateapplication')
def getallapplications(item: Item):
    try:
        with connect(
            host="localhost",
            user="manager",
            password="manager123",
            database="CreditDB"
        ) as connection:
            query = "SELECT * FROM users WHERE username='"+item.username+"' AND password='"+item.password+"'"
            with connection.cursor() as cursor:
                cursor.execute(query)
                postData = cursor.fetchone()
                if postData == None:
                    return {"res": "bad", "reason": "access"}
                query1 = "UPDATE applications SET Moderated='yes', Verdict=?, Moderator=(SELECT ID from users WHERE username=? AND password=?), Commentary=? WHERE ID=?"
                cursor.execute(query1, [item.verdict, item.username, item.password, item.commentary, item.id])
                return {"res":"good"}
    except Error as e:
        print(e)
        return {"res": "bad", "reason": "db"}
