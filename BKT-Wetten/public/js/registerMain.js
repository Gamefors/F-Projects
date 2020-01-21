window.localStorage.clear();
function sendPostRequest(data, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://" + window.location.host + "/" + type, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
    return xhttp.responseText
}

function wait(ms){
    let start = new Date().getTime();
    let end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
}

function register(){
    let username = document.getElementById("registerUsernameEntry").value;
    let password = document.getElementById("registerPasswordEntry").value;
    let registerButton = document.getElementById("registerButton");
    if(((username.includes("/") || username.includes(";")) || (username.includes(":") || username.includes("."))) || ((password.includes("/") || password.includes(";")) || (password.includes(":") || password.includes(".")))){
        alert("Benutzername oder Passwort enthält unzulässige zeichen.")
    }else{
        if(username.includes("*")){
            alert("Benutzername oder Passwort enthält unzulässige zeichen.") 
        }else{
            let response = sendPostRequest(username + "." + password, "createAccount");
            if(response == "true"){
                registerButton.setAttribute("disabled", "true");
                alert("Account wurde erfolgreich erstellt.\nKehre zum Login zurück...")
                window.location.href = "/"
            }else{
                alert(response)
            }
        }
    }
}

let registerButton = document.getElementById("registerButton");
registerButton.addEventListener("click", register, false);

