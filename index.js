function logIn(){
    let password =document.getElementById("password").value, username = document.getElementById("username").value, errorPlace = document.getElementById("errorPlace");
    try{
        if (username && password){
            document.getElementById("password").classList.remove("unright");
            document.getElementById("username").classList.remove("unright");
            fetch("http://192.168.31.23:8000/login", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password
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
                })
                
        } else if (!username && !password){
            errorPlace.innerHTML = "Оба поля должны быть заполнены";
            document.getElementById("password").classList.add("unright");
            document.getElementById("username").classList.add("unright");
        } else if (!password){
            errorPlace.innerHTML = "Введите пароль";
            document.getElementById("password").classList.add("unright");
            document.getElementById("username").classList.remove("unright");
        } else {
            errorPlace.innerHTML = "Введите логин";
            document.getElementById("username").classList.add("unright");
            document.getElementById("password").classList.remove("unright");
        }
    } catch(error){
        errorPlace.innerHTML="Что-то пошло не так";
    }
}