window.localStorage.clear();
function sendPostRequest(data, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://" + window.location.host + "/" + type, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
    return xhttp.responseText
}
function login(){
    let username = document.getElementById("loginUsernameEntry").value;
    let password = document.getElementById("loginPasswordEntry").value;
    let info = document.getElementById("info");
    info.innerText = "loging in..."
    let response = sendPostRequest(username + "." + password, "login");
    info.innerText = response
    if(response.includes("logged in")){
        response = response.split(";");
        window.localStorage.setItem("loggedIn", "true");
        window.localStorage.setItem("accountId", response[1]);
        window.location.href = "/overview"
    }
}


let loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", login, false);

