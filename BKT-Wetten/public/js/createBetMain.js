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

let createBetButton = document.getElementById("createButton");
createBetButton.addEventListener("click", createBet, false);

function createBet(){
    let teacherName_ = document.getElementById("teacherName");
    let startTime_ = document.getElementById("startTime");
    let minBet_ = document.getElementById("minBet");
    let bet = {teacherName:teacherName_.value, startTime:startTime_.value , minBet:"10", highestbidder:"", moneypool:0, participants:""}
    let response = sendPostRequest(bet.teacherName + ";" + bet.startTime + ";" + bet.minBet + ";" + bet.highestbidder + ";" + bet.moneypool + ";" + bet.participants, "createBet");
    let info = document.getElementById("info");
    info.innerText = response
    window.location.href = "/overview"
}