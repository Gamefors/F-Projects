let loggedIn = window.localStorage.getItem("loggedIn");
let accountId = window.localStorage.getItem("accountId");

if(loggedIn == null){
    alert("you are not logged in.")
    localStorage.clear();
    window.location.href = "/"
}

function sendPostRequest(data, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://" + window.location.host + "/" + type, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
    return xhttp.responseText
}

let account = sendPostRequest(accountId, "getAccountStats");
account = account.split(";");
console.log(account);
let body = document.body;
let wins = document.createElement("p");
let moneyFromBets = document.createElement("p");

wins.innerText = "Wetten gewonnen: " + account[0]
moneyFromBets.innerText = "Geld durch Wetten eingenommen: " + account[1]

body.appendChild(wins);
body.appendChild(moneyFromBets);