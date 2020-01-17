window.localStorage.clear();

function sendPostRequest(data, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://" + window.location.host + "/" + type, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
    return xhttp.responseText
}

function register(){
    let username = document.getElementById("registerUsernameEntry").value;
    let password = document.getElementById("registerPasswordEntry").value;
    let info = document.getElementById("info");
    info.innerText = "loging in..."
    let response = sendPostRequest(username + "." + password, "createAccount");
    info.innerText = response
    let registerButton = document.getElementById("registerButton");
    registerButton.setAttribute("disabled", "true");
}


let registerButton = document.getElementById("registerButton");
registerButton.addEventListener("click", register, false);

