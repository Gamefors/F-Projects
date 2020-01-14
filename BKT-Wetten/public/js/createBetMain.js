import {accounts} from "./accountsc.js";
let id_ = 0
let accountId = window.localStorage.getItem("id")
let account = getAccount();

function sendData(data, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://" + window.location.host + "/" + type);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}

if(account == undefined){
    alert("you are not logged in.")
    localStorage.clear();
    window.location.href = "/"
}

function getAccount(){
    let account_;
    accounts.forEach(account => {
        if(account.id == accountId){
            account_ = account
        }
    });
    return account_
}


let createBetButton = document.getElementById("createButton");
createBetButton.addEventListener("click", createBet, false);

function createBet(){
    let teacherName_ = document.getElementById("teacherName");
    let startTime_ = document.getElementById("startTime");
    let minBet_ = document.getElementById("minBet");
    let participants_ = []
    let bet = {teacherName:teacherName_.value, startTime:startTime_.value , minBet:minBet_.value, highestbidder:"niemand", moneypool:0, participants:participants_,id:id_}
    sendData(bet.teacherName + ";" + bet.startTime + ";" + bet.minBet + ";" + bet.highestbidder + ";" + bet.moneypool + ";" + bet.participants + ";" + bet.id, "createBetPost");
    let info = document.getElementById("info");
    info.innerText = "created bet."
    id_ = id_ + 1
}