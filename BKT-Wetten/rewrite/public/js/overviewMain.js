let loggedIn = window.localStorage.getItem("loggedIn");
let accountId = window.localStorage.getItem("accountId");

console.log(loggedIn);
console.log(accountId);

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

let logoutProfileButton = document.getElementById("logoutProfileButton");
logoutProfileButton.addEventListener("click", logout, false);