const { application } = require("express");

document.addEventListener("DOMContentLoaded", (event) => { 
    let errorPlace = document.getElementById("errorPlace");
    fetch("http://localhost:3000/getallapplications", {
        method: "POST",
        body: JSON.stringify({
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password")
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }).then((response)=>response.json())
        .then((data)=>{
            if (data.res=="good"){
                data.data.forEach(application => {
                    document.getElementsByTagName("aside").innerHTML+=`<div onclick="goTo(${application.ID})" id=""><p>Заявка №${application.ID}</p></div>`;
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