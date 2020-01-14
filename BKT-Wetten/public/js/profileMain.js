import {accounts} from "./accountsc.js";

let accountId = window.localStorage.getItem("id")
let account = getAccount();
if(account == undefined){
    alert("you are not logged in.")
    localStorage.clear();
    window.location.href = "/"
}

function logout(){
    localStorage.clear();
    window.location.href = "/"
}

function gotoOverview(){
    window.location.href = "/overview"
}

let profileLogoutButton = document.getElementById("profileLogoutButton");
profileLogoutButton.addEventListener("click", logout, false);

let profileGotoOverviewButton = document.getElementById("profileGotoOverviewButton");
profileGotoOverviewButton.addEventListener("click", gotoOverview, false)

function getAccount(){
    let account_;
    accounts.forEach(account => {
        if(account.id == accountId){
            account_ = account
        }
    });
    return account_
}


document.getElementById("profileName").innerText = "Name: " + account.name
document.getElementById("profileRank").innerText = "Rank: " + account.rank