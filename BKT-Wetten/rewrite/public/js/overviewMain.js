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

function logout(){
    localStorage.clear();
    window.location.href = "/"
}

function getBets(){
    let bets = []
    let response = sendPostRequest("", "getBets");
    if(response == "error"){
        return null
    }
    response = response.split("*");
    response.forEach(stringBet => {
        stringBet = stringBet.split(";");
        let bet = {id:stringBet[0], teacher:stringBet[1], startTime:stringBet[2] , minBet:stringBet[3], highestBet:stringBet[5], moneyPool:stringBet[4], participants:stringBet[6]}
        bets.push(bet)
    });
    return bets;
}

function refreshBets(){
    bets = getBets();
}

function getAccount(accountId){
    let response = sendPostRequest(accountId, "getAccount");
    if(response == "error"){
        return null
    }
    response = response.split(";");
    return {id:response[0], name:response[1], password:response[2], rank:response[3], money:response[4]};
}   

let logoutProfileButton = document.getElementById("logoutProfileButton");
logoutProfileButton.addEventListener("click", logout, false);

let refreshBetsButton = document.getElementById("refreshBetsButton");
refreshBetsButton.addEventListener("click", refreshBets, false);

let account = getAccount(accountId);
let bets = getBets();

document.getElementById("overviewProfileId").innerText = "Id: " + account.id
document.getElementById("overviewProfileName").innerText = "Name: " + account.name
document.getElementById("overviewProfileRank").innerText = "Rank: " + account.rank
document.getElementById("overviewProfileMoney").innerText = "Money: " + account.money + "€"

function gotoCreateBet(){
    window.location.href = "/createBet"
}

if(account.rank == "admin"){
    let createBetButton = document.createElement("button");
    createBetButton.innerText = "create bet"
    let profileSection = document.getElementById("profile");
    createBetButton.addEventListener("click", gotoCreateBet, false);
    profileSection.appendChild(createBetButton);
}

createActiveBets(bets)



//TODO: tidy up this function
function createActiveBets(bets){
    if(bets[0].teacher == undefined){
        return null
    }

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
    
        name.innerText = "Lehrer Name: " + bet.teacher
        startTime_.innerText = "Unterrichtsstunde startet um: " + bet.startTime
        minBet_.innerText = "minimal Einsatz ist: " + bet.minBet + "€"
        if(bet.participants == ""){
            highestBider.innerText = "Höchstbietender: niemand"
        }else{
            
            let accountIds = bet.participants.substring(1);
            accountIds = accountIds.split("_");
            accountIds.forEach(id => {
               // let account = getAccountWithId(id)
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
        if(bet.participants != ""){
            let accountIds = bet.participants.substring(1);
            accountIds = accountIds.split("_");
            accountIds.forEach(id => {
                let account = getAccount(id);
                let participantname = document.createElement("p");
                participantname.innerText = account.name
                let you = getAccount(accountId);
                if (you.name != account.name){
                    div.appendChild(yourbidP);
                    div.appendChild(bedInput);
                    div.appendChild(howLateTimeP);
                    div.appendChild(howLateTimeInput);
                    div.appendChild(spacer);
                    div.appendChild(submitButton);
                }else{
                    // TODO: here can other things be dislayed like u already set a bet
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
    sendPostRequest(betId + ";" + account.id + ";" + inputMoney.value + ";" + inputTime.value, "enterBet");
}