if (!sessionStorage.getItem("username") || !sessionStorage.getItem("password")) location.href="index.html";
document.addEventListener("DOMContentLoaded", (event) => { 
    let errorPlace = document.getElementById("errorPlace");
    try{
        fetch("http://localhost:3000/getallapplications", {
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
                    data.data.forEach(application => {
                        document.getElementsByTagName("aside").innerHTML+=`<div onclick="goTo(${application.ID})" id="application${id}"><p>Заявка №${application.ID}</p></div>`;
                    });
                } else {
                    switch (data.reason) {
                        case "db":
                            errorPlace.classList.remove("hidden");
                             errorPlace.innerHTML = "Ошибка базы данных. Попробуйте позже";
                            break;
                        case "access":
                            errorPlace.classList.remove("hidden");
                            errorPlace.innerHTML = "Отказано в доступе";
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
        fetch("http://localhost:3000/getoneapplication", {
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
                    let application = data.data;
                    document.getElementById("applicationPlace").innerHTML = `<table><tbody>
                    <tr>
                        <td>ФИО:</td>
                        <td>${application.FIO}</td>
                    </tr>
                    <tr>
                        <td>Дата рождения:</td>
                        <td>${application.BirthDate.slice(0, 2)}.${application.BirthDate.slice(2, 4)}.${application.BirthDate.slice(4, 8)}</td>
                    </tr>
                    <tr>
                        <td>Паспортные данные:</td>
                        <td>${application.PassportData.slice(0, 4)} ${application.PassportData.slice(4, 10)}</td>
                    </tr>
                    <tr>
                        <td>Адрес регистрации:</td>
                        <td>${application.RegistrationAdress}</td>
                    </tr>
                    <tr>
                        <td>Адрес проживания:</td>
                        <td>${application.LivingAdress}</td>
                    </tr>
                    <tr>
                        <td>Семейное положение:</td>
                        <td>${application.IsMarried}</td>
                    </tr>
                    <tr>
                        <td>Наличие детей:</td>
                        <td>${application.HasChildren}</td>
                    </tr>
                    <tr>
                        <td>Место работы:</td>
                        <td>${application.WorkPlace}</td>
                    </tr>
                    <tr>
                        <td>Стаж работы:</td>
                        <td>${application.WorkTimeInMonths}</td>
                    </tr>
                    <tr>
                        <td>Должность:</td>
                        <td>${application.WorkName}</td>
                    </tr>
                    <tr>
                        <td>Ежемесячный подтвержденный доход по месту работы:</td>
                        <td>${application.Salary}</td>
                    </tr>
                    <tr>
                        <td>Документ, подтверждающий доход:</td>
                        <td>${application.SalaryDocument}</td>
                    </tr>
                    <tr>
                        <td>Ежемесячный дополнительный доход:</td>
                        <td>${application.AdditionalIncome}</td>
                    </tr>
                    <tr>
                        <td>Дополнительный доход подтвержден документально:</td>
                        <td>${application.AdditionalIncomeDocument}</td>
                    </tr>
                    <tr>
                        <td>Источник дополнительного дохода:</td>
                        <td>${application.FromAdditionalIncome}</td>
                    </tr>
                    <tr>
                        <td>Наличие сбережений на счетах в Банке:</td>
                        <td>${application.HasMoney}</td>
                    </tr>`;
                    if (application.HasMoney!="нет"){
                        document.getElementById("applicationPlace").innerHTML += `
                    <tr>
                        <td>Категория сбережения:</td>
                        <td>${application.MoneyCategory}</td>
                    </tr>
                    <tr>
                        <td>Категория сбережения:</td>
                        <td>${application.HowMuchMoney}</td>
                    </tr>`;}
                    if (SalaryDocument!="нет"){
                        document.getElementById("applicationPlace").innerHTML += `
                    <tr>
                        <td>2-НДФЛ:</td>
                        <td>${application.IncomeLink1}</td>
                    </tr>`;}
                    if (SalaryDocument){
                        document.getElementById("applicationPlace").innerHTML += `
                    <tr>
                        <td>подтверждение доп. дохода:</td>
                        <td>${application.IncomeLink1}</td>
                    </tr>`;}
                    let scores = 0, age = new Date().getFullYear() - application.BirthDate.slice(4, 8);
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
                    if (application.IsMarried=="Холост"){
                        scores+=3;
                    } else if (application.IsMarried=="Женат" || application.IsMarried=="Замужем"){
                        scores+=2;
                    } else {
                        scores+=5;
                    }
                    //Наличие детей
                    if (application.HasChildren=="Да"){
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
                    if (application.WorkPlace!="Нет"){
                        scores+=2;
                    } else{
                        switch (application.FromAdditionalIncome) {
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
                    //ПДН
                    let PDN;
                    if (application.AdditionalIncomeDocument){
                        PDN = getMonthPay()/(application.AdditionalIncome+application.Salary);
                    } else {
                        PDN = getMonthPay()/(application.Salary);
                    }
    
                    if (PDN<=0.7){
                        scores+=1;
                    } else if (70<PDN<=95){
                        scores+=10
                    } else {
                        scores+=20;
                    }
                    //Общий доход
                    let allIncome = application.Salary + application.AdditionalIncome;
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
                    if (application.HasMoney=="Да"){
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
                    document.getElementById("applicationPlace").innerHTML += ` 
                    <tr>
                        <td>Итого</td>
                        <td>${scores}</td>
                    </tr>
                    <tr>
                        <td>Уровень риска:</td>
                        <td>${riskLevel}</td>
                    </tr>`;
                    document.getElementById("applicationPlace").innerHTML += `</tbody></table>`
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
        errorPlace.classList.remove("hidden");
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