function logIn(){
    fetch("http://localhost:3000/login", {
    method: "POST",
    body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then((response)=>response.json())
    .then((data)=>{
        if (data.res=="good"){
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
        } else {
            switch (data.reason) {
                case "db":
                    document.getElementById("errorPlace").innerHTML = "Ошибка базы данных. Попробуйте позже";
                    break;
                case "access":
                    document.getElementById("errorPlace").innerHTML = "Неверный логин и пароль";
                default:
                    break;
            }
        }
    })

}