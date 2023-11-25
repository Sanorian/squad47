if (!sessionStorage.getItem("username") || !sessionStorage.getItem("password")) location.href="index.html";
document.addEventListener("DOMContentLoaded", (event) => { 
    let errorPlace = document.getElementById("errorPlace");
    fetch("http://localhost:3000/getallapplications", {
        method: "POST",
        body: JSON.stringify({
            username: sessionStorage.getItem("username"),
            password: sessionStorage.getItem("password")
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then((response)=>response.json())
        .then((data)=>{
            if (data.res=="good"){
                data.data.forEach(application => {
                    document.getElementsByTagName("aside").innerHTML+=`<div onclick="goTo(${application.ID})" id="application${id}"><p>Заявка №${application.ID}</p></div>`;
                });
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
});

function goTo(id){
    if (sessionStorage.getItem("lastID")) document.getElementById(`application${sessionStorage.getItem("lastID")}`).classList.remove("chosen");
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
        }).then((response)=>response.json())
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
}