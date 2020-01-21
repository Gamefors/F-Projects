let loggedIn = window.localStorage.getItem("loggedIn");
let accountId = window.localStorage.getItem("accountId");

function sendPostRequest(data, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://" + window.location.host + "/" + type, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
    return xhttp.responseText
}

function getAccounts(){
	let accounts = []
	let response = sendPostRequest("", "getAccounts");
	if(response == "ERROR"){
		return null
	}
	response = response.split("*");
	response.forEach(stringAccount => {
		stringAccount = stringAccount.split(";");
		let account = {id:stringAccount[0], name:stringAccount[1], password:stringAccount[2] , rank:stringAccount[3], money:stringAccount[4], wins:stringAccount[5], moneyFromBets:stringAccount[6]}
		accounts.push(account)
	});
	return accounts;
}

function getAccount(accountId){
	let response = sendPostRequest(accountId, "getAccount");
	if(response == "ERROR"){
		return null
	}
	response = response.split(";");
	return {id:response[0], name:response[1], password:response[2], rank:response[3], money:response[4]};
} 

if(loggedIn == null){
	alert("you are not logged in.")
	localStorage.clear();
	window.location.href = "/"
}

let account = getAccount(accountId);

function deleteAccount(id){
	let response = sendPostRequest(id, "deleteAccount");
	alert(response);
	document.location.reload();
}

function updateAccount(name, password, rank, money, wins, moneyFromBets){
	alert("updateAccount");
	//alert(sendPostRequest(name + ";" + password + ";" + rank + ";" +  money + ";" +  wins + ";" +  moneyFromBets, "updateAccount"))
	document.location.reload();
}

if(account.rank == "admin"){
	let accounts = getAccounts();
	let sqLiteAccountsTable = document.getElementById("sqLiteAccountsTable");
	accounts.forEach(account => {
		let tr = document.createElement("tr");
		
		let tdId = document.createElement("td");
		let tdName = document.createElement("td");
		let tdPassword = document.createElement("td");
		let tdRank = document.createElement("td");
		let tdMoney = document.createElement("td");
		let tdWins = document.createElement("td");
		let tdMoneyFromBets = document.createElement("td");
		let tdUpdateButton = document.createElement("td");
		let tdDeleteButton = document.createElement("td");

		let updateButton = document.createElement("button");
		let deleteButton = document.createElement("button");
		
		tdId.innerText = account.id
		tdName.innerText = account.name
		tdPassword.innerText = account.password
		tdRank.innerText = account.rank
		tdMoney.innerText = account.money
		tdWins.innerText = account.wins
		tdMoneyFromBets.innerText = account.moneyFromBets

		updateButton.innerText = "update"
		deleteButton.innerText = "delete"
		updateButton.addEventListener("click", function(){
            updateAccount();
		}, false);
		deleteButton.addEventListener("click", function(){
            deleteAccount(account.id);
        }, false);

		tdUpdateButton.appendChild(updateButton);
		tdDeleteButton.appendChild(deleteButton);

		tr.appendChild(tdId);
		tr.appendChild(tdName);
		tr.appendChild(tdPassword);
		tr.appendChild(tdRank);
		tr.appendChild(tdMoney);
		tr.appendChild(tdWins);
		tr.appendChild(tdMoneyFromBets);

		tr.appendChild(tdUpdateButton);
		tr.appendChild(tdDeleteButton);

		sqLiteAccountsTable.appendChild(tr);
	});
}else{
	alert("Du bist kein Admin.");
	window.location.href = "/overview"
}
