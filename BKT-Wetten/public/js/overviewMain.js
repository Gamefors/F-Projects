import {accounts} from "./accountsc.js";
let accountId = window.localStorage.getItem("id");
let account = getAccount();
if(account == undefined){
    alert("you are not logged in.")
    localStorage.clear();
    window.location.href = "/"
}

if(account.rank == "admin"){
    let createBetButton = document.createElement("button");
    createBetButton.innerText = "create bet"
    let profileSection = document.getElementById("profile");
    createBetButton.addEventListener("click", gotoCreateBet, false);
    profileSection.appendChild(createBetButton);
    
}

function gotoCreateBet(){
    window.location.href = "/createBet"
}

function logout(){
    localStorage.clear();
    window.location.href = "/"
}

function gotoProfile(){
    window.location.href = "/profile"
}

let logoutProfileButton = document.getElementById("logoutProfileButton");
logoutProfileButton.addEventListener("click", logout, false);

let gotoProfileButton = document.getElementById("gotoProfileButton");
gotoProfileButton.addEventListener("click", gotoProfile, false);

let refreshBetsButton = document.getElementById("refreshBetsButton");
refreshBetsButton.addEventListener("click", getBets, false);


function getAccount(){
    let account_;
    accounts.forEach(account => {
        if(account.id == accountId){
            account_ = account
        }
    });
    return account_
}
function getAccountWithId(id){
    let account_;
    accounts.forEach(account => {
        if(account.id == id){
            account_ = account
        }
    });
    return account_
}

function placeBet(betId){
    let div = document.getElementById("betDiv" + betId);
    let inputMoney = document.getElementById("bedInput"+ betId)
    let inputTime = document.getElementById("howLateInput" + betId)
    let yourBidP = document.getElementById("yourbidP" + betId)
    let howLateTimeP = document.getElementById("howLateTimeP" + betId)
    let submitButton = document.getElementById("submitButton" + betId)

    div.removeChild(inputMoney);
    div.removeChild(inputTime);
    div.removeChild(yourBidP);
    div.removeChild(howLateTimeP);
    div.removeChild(submitButton);
    sendData(betId + ";" + account.id + ";" + inputMoney.value + ";" + inputTime.value, "enterBet");

}

document.getElementById("overviewProfileName").innerText = "Name: " + account.name
document.getElementById("overviewProfileRank").innerText = "Rank: " + account.rank
document.getElementById("overviewProfileMoney").innerText = "Money: " + account.money + "€"

function getBets(){
    const url="http://" + window.location.host + "/bets";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    let bets = []
    bets = JSON.parse(xmlHttp.responseText)
    createActiveBets(bets);
}


function sendData(data, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://" + window.location.host + "/" + type);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}

function createActiveBets(bets){
    let activeBetsSection = document.getElementById("activeBets");
    document.body.removeChild(activeBetsSection);
    let activeBetsSectionNew = document.createElement("section");
    activeBetsSectionNew.setAttribute("id", "activeBets")
    document.body.appendChild(activeBetsSectionNew);
    let h1 = document.createElement("h1");
    h1.innerText = "Active Bets"
    activeBetsSectionNew.appendChild(h1)
    
    

    bets.forEach(bet => {
        let div = document.createElement("div");
        div.setAttribute("id", "betDiv" + bet.id);
        let name = document.createElement("p");
        let startTime_ = document.createElement("p");
        let minBet_ = document.createElement("p");
        let highestBider = document.createElement("p");
        let participantsP = document.createElement("p");
        let participantsDiv = document.createElement("p");
        let yourbidP = document.createElement("p");
        let bedInput = document.createElement("input");
        let howLateTimeP = document.createElement("p");
        let howLateTimeInput = document.createElement("input");
        let spacer = document.createElement("p");
        let submitButton = document.createElement("button");
        let spacer2 = document.createElement("p");
        spacer2.innerText = "========================================"
    
        name.innerText = "Lehrer Name: " + bet.teacherName
        startTime_.innerText = "Unterrichtsstunde startet um: " + bet.startTime
        minBet_.innerText = "minimal Einsatz ist: " + bet.minBet + "€"
        if(bet.participants.length == 0){
            highestBider.innerText = "Höchstbietender: niemand"
        }else{
            
            let accountIds = bet.participants.substring(1);
            accountIds = accountIds.split(";");
            accountIds.forEach(id => {
                let account = getAccountWithId(id)
                //TODO: do it here
            });
        }
        
        
        yourbidP.innerText = "Deine Wette: "
        yourbidP.setAttribute("id", "yourbidP" + bet.id);
        bedInput.setAttribute("id", "bedInput" + bet.id);
        howLateTimeP.innerText = "Wie viel verspätung (in minuten):"
        howLateTimeP.setAttribute("id", "howLateTimeP" + bet.id);
        howLateTimeInput.setAttribute("id", "howLateInput" + bet.id);
        submitButton.setAttribute("id", "submitButton" + bet.id);
        submitButton.innerText = "Wette abgeben."
        submitButton.addEventListener("click", function(){
            placeBet(bet.id);
        }, false);
        div.appendChild(name);
        div.appendChild(startTime_);
        div.appendChild(minBet_);
        div.appendChild(highestBider);
        div.appendChild(participantsP);
        div.appendChild(participantsDiv);
        participantsP.innerText = "Teilnehmer: "
        if(bet.participants.length != 0){
            let accountIds = bet.participants.substring(1);
            accountIds = accountIds.split(";");
            accountIds.forEach(id => {
                let account = getAccountWithId(id)
                let participantname = document.createElement("p");
                participantname.innerText = account.name
                let you = getAccount();
                if (you.name != account.name){
                    div.appendChild(yourbidP);
                    div.appendChild(bedInput);
                    div.appendChild(howLateTimeP);
                    div.appendChild(howLateTimeInput);
                    div.appendChild(spacer);
                    div.appendChild(submitButton);
                }else{
                    // TODO: here can other things be dislayed like how much u have betted etc
                }
                participantsDiv.appendChild(participantname);
            });
        }else{
            div.appendChild(yourbidP);
            div.appendChild(bedInput);
            div.appendChild(howLateTimeP);
            div.appendChild(howLateTimeInput);
            div.appendChild(spacer);
            div.appendChild(submitButton); 
        }
        div.appendChild(spacer2);
        activeBetsSectionNew.appendChild(div);
    });
}

