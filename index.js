function logIn(){
    let password =document.getElementById("password").value, username = document.getElementById("username").value, errorPlace = document.getElementById("errorPlace");
    if (username && password){
        document.getElementById("password").classList.remove("unright");
        document.getElementById("username").classList.remove("unright");
        fetch("http://localhost:3000/login", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            }).then((response)=>response.json())
            .then((data)=>{
                if (data.res=="good"){
                    sessionStorage.setItem("username", data.username);
                    sessionStorage.setItem("password", data.password);
                    location.href="main.html";
                } else {
                    switch (data.reason) {
                        case "db":
                            errorPlace.innerHTML = "Ошибка базы данных. Попробуйте позже";
                            break;
                        case "access":
                            errorPlace.innerHTML = "Неверный логин и пароль";
                    }
                }
            });
    } else if (!username){
        errorPlace.innerHTML = "Введите логин";
        document.getElementById("username").classList.add("unright");
    } else if (!password){
        errorPlace.innerHTML = "Введите пароль";
        document.getElementById("password").classList.add("unright");
    } else {
        errorPlace.innerHTML = "Оба поля должны быть заполнены";
        document.getElementById("password").classList.add("unright");
        document.getElementById("username").classList.add("unright");
    }

}