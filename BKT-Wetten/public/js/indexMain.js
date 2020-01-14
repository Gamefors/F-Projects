import {accounts} from "./accountsc.js";

let loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", login, false);

function login(){
    let username = document.getElementById("loginUsernameEntry").value;
    let password = document.getElementById("loginPasswordEntry").value;
    let info = document.getElementById("info");
    accounts.forEach(account => {
        if(account.name.toLowerCase() == username.toLowerCase()){
            if(account.password == password){
                window.localStorage.setItem("id", account.id);
                info.innerText = ("logging in ...");
                window.location.href = "/overview"
            }else{
                info.innerText = ("failed wrong username or password.");
            }
        }
    });
}