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

let account = getAccount(accountId);

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

