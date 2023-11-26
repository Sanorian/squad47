if (!sessionStorage.getItem("username") || !sessionStorage.getItem("password")) location.href="index.html";
document.addEventListener("DOMContentLoaded", (event) => { 
    let errorPlace = document.getElementById("errorPlace");
    document.getElementById("usernamePlace").innerHTML = sessionStorage.getItem("username");
    try{
        fetch("http://192.168.31.23:8000/getallapplications", {
            method: "POST",
            body: JSON.stringify({
                username: sessionStorage.getItem("username"),
                password: sessionStorage.getItem("password")
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            }).catch(err=>{
                console.log(err);
                errorPlace.innerHTML="Что-то пошло не так";
            })
            .then((response)=>response.json())
            .then((data)=>{
                if (data.res=="good"){
                    data.result.forEach(application => {
                        let id = application[0];
                        document.getElementsByTagName("aside")[0].innerHTML+=`<div onclick="goTo(${id})" id="application${id}"><p>Заявка №${id}</p></div>`;
                    });
                } else {
                    switch (data.reason) {
                        case "db":
                             errorPlace.innerHTML = "Ошибка базы данных. Попробуйте позже";
                            break;
                        case "access":
                            errorPlace.innerHTML = "Отказано в доступе";
                        case "noone":
                            eror
                    }
                }
            });
    } catch(error){
        errorPlace.innerHTML = "Что-то пошло не так";
    }
});

function goTo(id){
    let errorPlace = document.getElementById("errorPlace");
    if (sessionStorage.getItem("lastID")) document.getElementById(`application${sessionStorage.getItem("lastID")}`).classList.remove("chosen");
    try{
        fetch("http://192.168.31.23:8000/getoneapplication", {
            method: "POST",
            body: JSON.stringify({
                username: sessionStorage.getItem("username"),
                password: sessionStorage.getItem("password"),
                id: id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            }).catch(err=>{
                console.log(err);
                errorPlace.innerHTML="Что-то пошло не так";
            })
            .then((response)=>response.json())
            .then((data)=>{
                if (data.res=="good"){
                    let application = data.result;
                    let table = `<table><tbody>
                    <tr>
                        <td>ФИО:</td>
                        <td>${application[1]}</td>
                    </tr>
                    <tr>
                        <td>Дата рождения:</td>
                        <td>${application[2].slice(0, 2)}.${application[1].slice(2, 4)}.${application[1].slice(4, 8)}</td>
                    </tr>
                    <tr>
                        <td>Паспортные данные:</td>
                        <td>${application[3].slice(0, 4)} ${application[3].slice(4, 10)}</td>
                    </tr>
                    <tr>
                        <td>Адрес регистрации:</td>
                        <td>${application[4]}</td>
                    </tr>
                    <tr>
                        <td>Адрес проживания:</td>
                        <td>${application[5]}</td>
                    </tr>
                    <tr>
                        <td>Семейное положение:</td>
                        <td>${application[6]}</td>
                    </tr>
                    <tr>
                        <td>Наличие детей:</td>
                        <td>${application[7]}</td>
                    </tr>
                    <tr>
                        <td>Место работы:</td>
                        <td>${application[8]}</td>
                    </tr>
                    <tr>
                        <td>Стаж работы:</td>
                        <td>${application[9]}</td>
                    </tr>
                    <tr>
                        <td>Должность:</td>
                        <td>${application[10]}</td>
                    </tr>
                    <tr>
                        <td>Ежемесячный подтвержденный доход по месту работы:</td>
                        <td>${application[11]}</td>
                    </tr>
                    <tr>
                        <td>Документ, подтверждающий доход:</td>
                        <td>${application[12]}</td>
                    </tr>
                    <tr>
                        <td>Ежемесячный дополнительный доход:</td>
                        <td>${application[13]}</td>
                    </tr>
                    <tr>
                        <td>Дополнительный доход подтвержден документально:</td>
                        <td>${application[14]}</td>
                    </tr>
                    <tr>
                        <td>Источник дополнительного дохода:</td>
                        <td>${application[15]}</td>
                    </tr>
                    <tr>
                        <td>Наличие сбережений на счетах в Банке:</td>
                        <td>${application[16]}</td>
                    </tr>`;
                    if (application[16]!="нет"){
                        table += `
                    <tr>
                        <td>Категория сбережения:</td>
                        <td>${application[17]}</td>
                    </tr>
                    <tr>
                        <td>Сумма сбережений:</td>
                        <td>${application[18]}</td>
                    </tr>`;}
                    if (application[12]!="нет"){
                        table += `
                    <tr>
                        <td>2-НДФЛ:</td>
                        <td>${application[19]}</td>
                    </tr>`;}
                    if (application[12]){
                        table += `
                    <tr>
                        <td>подтверждение доп. дохода:</td>
                        <td>${application[20]}</td>
                    </tr>`;}
                    let scores = 0, age = new Date().getFullYear() - application[2].slice(4, 8);
                    // Возраст
                    if (age<=25) {
                        scores+=5;
                    } else if (26<age<=55){
                        scores+=1;
                    } else if (56<age<74){
                        scrores+=3;
                    } else {
                        scores+=10;
                    }
                    //Семейное положение
                    if (application[6]=="Холост"){
                        scores+=3;
                    } else if (application[6]=="Женат" || application[6]=="Замужем"){
                        scores+=2;
                    } else {
                        scores+=5;
                    }
                    //Наличие детей
                    if (application[7]=="Да"){
                        scores+=3;
                    } else {
                        scores+=5;
                    }
                    //Кредитная история клиента
                    let creditRating = getCreditRating();
                    if (creditRating=="Хорошая"){
                        scores+=1;
                    }else if (creditRating=="Средняя"){
                        scores+=8;
                    }else if (creditRating=="Плохая"){
                        scores+=15;
                    }else{
                        scores+=3;
                    }
                    //Основной источник получения доходов
                    if (application[8]!="Нет"){
                        scores+=2;
                    } else{
                        switch (application[15]) {
                            case "Пенсия":
                                scores+=2;
                                break;
                            case isBusiness()=="Да.":
                                scores+=7;
                                break;
                            default:
                                scores+=15;
                                break;
                        }
                    }
                    //Стаж
                    if (application[9]>60){
                        scores+=2;
                    } else if (12<application[9]<=60){
                        scores+=3;
                    } else {
                        scores+=10;
                    }
                    //ПДН
                    let PDN;
                    if (application[14]){
                        PDN = getMonthPay()/(application[13]+application[11]);
                    } else {
                        PDN = getMonthPay()/(application[11]);
                    }
    
                    if (PDN<=0.7){
                        scores+=1;
                    } else if (70<PDN<=95){
                        scores+=10
                    } else {
                        scores+=20;
                    }
                    //Общий доход
                    let allIncome = application[11] + application[13];
                    if (allIncome>250000){
                        scores+=3;
                    } else if (101000<allIncome<=250000){
                        scores+=5;
                    }else if (50000<allIncome<=100000){
                        scores+=7;
                    } else {
                        scores+=15;
                    }
                    //Есть ли сбережения
                    if (application[16]=="Да"){
                        scores+=1;
                    } else {
                        scores+=5;
                    }
                    let riskLevel;
                    if (scores<=30){
                        riskLevel= "Низкий";
                    } else if (30<scores<=70){
                        riskLevel = "Средний";
                    } else {
                        riskLevel = "Высокий";
                    }
                    table += ` 
                    <tr>
                        <td>Итого</td>
                        <td>${scores}</td>
                    </tr>
                    <tr>
                        <td>Уровень риска:</td>
                        <td>${riskLevel}</td>
                    </tr></tbody></table>`;
                    document.getElementById("applicationPlace").innerHTML = table;
                    document.getElementById('applicationPlace').innerHTML +=`<div><textarea placeholder="Комментарий" id="commentary"></textarea>`;
                    document.getElementById("applicationPlace").innerHTML += `<div><button onclick="unapproveApplication(${id})">Неодобрить</button><button onclick="approveApplication(${id})">Одобрить</button></div></div>`
                    sessionStorage.setItem("lastID", id);
                    document.getElementById(`application${id}`).classList.add("chosen");
                } else {
                    switch (data.reason) {
                        case "db":
                             errorPlace.innerHTML = "Ошибка базы данных. Попробуйте позже";
                            break;
                        case "access":
                            errorPlace.innerHTML = "Отказано в доступе";
                    }
                }
        });
    } catch(error){
        errorPlace.innerHTML = "Что-то пошло не так";
    }
}

function getCreditRating(){
    //Получаем данные из кредитного рейтинга
}

function getMonthPay(){
    //Из чего рассчитывается ежемесячный платеж, если его как раз определяет банк?
}

function isBusiness(business){
    let token = "";
    fetch("https://api.gigachat.ai/chatbots", {
        method: "POST",
        body: JSON.stringify({
            "name": "question",
            "response": {
                "n": 1,
                "top_p": 1,
                "stream": true,
                "max_tokens": 200,
                "memory_size": 0,
                "temperature": 0.7,
                "system_persona": "You are a friendly chatbot to help answer questions! Given the following sections from a website, answer the question using only that information. If you are unsure and the answer and it is not explicitly written in the context sections, say \"Sorry, I don't know how to help with that.\"",
                "presence_penalty": 0,
                "frequency_penalty": 0
            },
            "restrictions": {
                "hostnames": [],
                "ip_addresses": []
            },
            "documents": {
                "results": {
                    "match_count": 3,
                    "match_threshold": 0.78
                },
                "text_splitter": {
                    "chunk_size": 1000,
                    "chunk_overlap": 200
                }
            }
        }),
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data:{
            "conversation_id": "12345",
            "user_id": "squad47@mail.ru",
            "prompt": "Отвечай только Да или Нет. В твоем ответе должно быть только одно слово. Можно ли сказать, что "+business+" - предпринимательство?"
        }
        }).then((response)=>response.json())
        .then((data)=>{
            return data.anwser;
        });
}
function approveApplication(id){
    let errorPlace = document.getElementById("errorPlace")
    if (document.getElementById("commentary").value){
        try{
            fetch("http://192.168.31.23:8000/updateapplication", {
                method: "POST",
                body: JSON.stringify({
                    username: sessionStorage.getItem("username"),
                    password: sessionStorage.getItem("password"),
                    id: String(id),
                    verdict: "approve",
                    commentary: document.getElementById("commentary").value
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
                }).catch(err=>{
                    console.log(err);
                    errorPlace.innerHTML="Что-то пошло не так";
                })
                .then((response)=>response.json())
                .then((data)=>{
                    if (data.res=="good"){
                        document.getElementById(`application${id}`).remove();
                        document.getElementById("applicationPlace").innerHTML = "";
                        } else {
                        switch (data.reason) {
                            case "db":
                                 errorPlace.innerHTML = "Ошибка базы данных. Попробуйте позже";
                                break;
                            case "access":
                                errorPlace.innerHTML = "Отказано в доступе";
                        }
                    }
                });
            }catch(err){
                console.log(err);
            }
    }else{
        errorPlace.innerHTML = "Введите комментарий перед вынесением решения";
    }
}

function unapproveApplication(id){
    let errorPlace = document.getElementById("errorPlace")
    if (document.getElementById("commentary").value){
        try{
            fetch("http://192.168.31.23:8000/updateapplication", {
                method: "POST",
                body: JSON.stringify({
                    username: sessionStorage.getItem("username"),
                    password: sessionStorage.getItem("password"),
                    id: String(id),
                    verdict: "unapprove",
                    commentary: document.getElementById("commentary").value
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
                }).catch(err=>{
                    console.log(err);
                    errorPlace.innerHTML="Что-то пошло не так";
                })
                .then((response)=>response.json())
                .then((data)=>{
                    if (data.res=="good"){
                        document.getElementById(`application${id}`).remove();
                        document.getElementById("applicationPlace").innerHTML = "";
                        } else {
                        switch (data.reason) {
                            case "db":
                                 errorPlace.innerHTML = "Ошибка базы данных. Попробуйте позже";
                                break;
                            case "access":
                                errorPlace.innerHTML = "Отказано в доступе";
                        }
                    }
                });
            }catch(err){
                console.log(err);
            }
    }else{
        errorPlace.innerHTML = "Введите комментарий перед вынесением решения";
    }
}

function logOut(){
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
    location.href="index.html";
}