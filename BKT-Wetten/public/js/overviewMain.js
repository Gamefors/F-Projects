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
	if(response == "ERROR"){
		return bets;
	}else{
		if(response){
			response = response.split("*");
			response.forEach(stringBet => {
				stringBet = stringBet.split(";");
				let bet = {id:stringBet[0], teacher:stringBet[1], startTime:stringBet[2] , minBet:stringBet[3], highestBet:stringBet[5], moneyPool:stringBet[4], participants:stringBet[6]}
				bets.push(bet)
			});
			return bets;
		}else{
			return bets;
		}
	}
}

function refreshBets(){
	document.location.reload()
}

function getAccount(accountId){
	let response = sendPostRequest(accountId, "getAccount");
	if(response == "ERROR"){
		return null
	}
	response = response.split(";");
	return {id:response[0], name:response[1], password:response[2], rank:response[3], money:response[4]};
}   

function getAccountByName(accountName){
	let response = sendPostRequest(accountName, "getAccountByName");
	if(response == "ERROR"){
		return null
	}
	response = response.split(";");
	return {id:response[0], name:response[1], password:response[2], rank:response[3], money:response[4]};
} 

let logoutProfileButton = document.getElementById("logoutProfileButton");
logoutProfileButton.addEventListener("click", logout, false);

let refreshBetsButton = document.getElementById("refreshBetsButton");
refreshBetsButton.addEventListener("click", refreshBets, false);

let statsButton = document.getElementById("statsButton");
statsButton.addEventListener("click", gotoStats, false);

function gotoStats(){
	window.location.href = "/stats"
}

function endBet(betId){
	let response = sendPostRequest(betId,"endBet").split(";");
	alert(response[0] + " hat mit " + response[2] + " Minuten verspätung und " + response[1] + "€ Einsatz gewonnen.");
	document.location.reload();
}

let account = getAccount(accountId);
let bets;
bets = getBets();

document.getElementById("overviewProfileId").innerText = "Id: " + account.id
document.getElementById("overviewProfileName").innerText = "Name: " + account.name
document.getElementById("overviewProfileRank").innerText = "Rang: " + account.rank
document.getElementById("overviewProfileMoney").innerText = "Geld: " + account.money + "€"

function gotoCreateBet(){
	window.location.href = "/createBet"
}

function gotoAdminPanel(){
	window.location.href = "/adminPanel"
}

if(account.rank == "admin"){
	let createBetButton = document.createElement("button");
	createBetButton.innerText = "Neue Wette erstellen"
	let profileSection = document.getElementById("profile");
	createBetButton.addEventListener("click", gotoCreateBet, false);
	profileSection.appendChild(createBetButton);
	let gotoAdminPanelButton = document.createElement("button");
	gotoAdminPanelButton.innerText = "Admin Panel"
	gotoAdminPanelButton.addEventListener("click", gotoAdminPanel, false);
	profileSection.appendChild(document.createElement("p"));
	profileSection.appendChild(gotoAdminPanelButton);
}

createActiveBets(bets)

function createActiveBets(bets){

	let activeBetsSectionNew = document.createElement("section");
	let activeBetsSection = document.getElementById("activeBets");
	let h1 = document.createElement("h1");
	
	h1.innerText = "Aktive Wetten"
	activeBetsSectionNew.setAttribute("id", "activeBets")
	
	document.body.removeChild(activeBetsSection);
	document.body.appendChild(activeBetsSectionNew);
	activeBetsSectionNew.appendChild(h1)
	
	bets.forEach(bet => {
		let div = document.createElement("div");
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
		
		spacer2.innerText = ""
		div.setAttribute("id", "betDiv" + bet.id);
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
		
		
		yourbidP.innerText = "Deine Wette(nur Zahl): "
		yourbidP.setAttribute("id", "yourbidP" + bet.id);
		bedInput.setAttribute("id", "bedInput" + bet.id);
		howLateTimeP.innerText = "Wie viel verspätung (in minuten):"
		howLateTimeP.setAttribute("id", "howLateTimeP" + bet.id);
		howLateTimeInput.setAttribute("id", "howLateInput" + bet.id);
		submitButton.setAttribute("id", "submitButton" + bet.id);
		submitButton.innerText = "Wette abgeben."
		
		div.appendChild(name);
		div.appendChild(startTime_);
		//div.appendChild(highestBider);
		div.appendChild(participantsP);
		div.appendChild(participantsDiv);
		participantsP.innerText = "Teilnehmer: "
		if(bet.participants != ""){
			let accountNames = bet.participants;
			let notBettedYet = true
			accountNames = accountNames.split("/");
			accountNames.forEach(name => {
				if(name != ""){
					
					let account_ = getAccountByName(name);
					let newName = name.split(":");
					if(newName[0] == account.name){
						notBettedYet = false
					}
					
					let participantname = document.createElement("p");
					participantname.innerText = "-" + account_.name + " mit " + newName[1] + "€" + " verspätung: " + newName[2] + " Minuten."
					participantsDiv.appendChild(participantname);
				}
				
			});
			
			
			if(notBettedYet){
				let today = new Date();
				let currMins = today.getMinutes()
				let currHours = today.getHours()
				if(currMins >= bet.startTime.split(":")[1]){
					howLateTimeP.innerText = "Es können keine Wetten mehr plaziert werden da die Stunde angefangen hatt."
					div.appendChild(howLateTimeP);
				}else{
					if(currHours > bet.startTime.split(":")[0]){
						howLateTimeP.innerText = "Es können keine Wetten mehr plaziert werden da die Stunde angefangen hatt."
						div.appendChild(howLateTimeP);
					}else{
						div.appendChild(yourbidP);
						div.appendChild(bedInput);
						div.appendChild(howLateTimeP);
						div.appendChild(howLateTimeInput);
						div.appendChild(spacer);
						div.appendChild(submitButton);
					}
				}
				
			}
			
		}else{
							 
			let today = new Date();
			let currMins = today.getMinutes()
			let currHours = today.getHours()
			if(currMins >= bet.startTime.split(":")[1]){
				howLateTimeP.innerText = "Es können keine Wetten mehr plaziert werden da die Stunde angefangen hatt."
				div.appendChild(howLateTimeP);
			}else{
				if(currHours > bet.startTime.split(":")[0]){
					howLateTimeP.innerText = "Es können keine Wetten mehr plaziert werden da die Stunde angefangen hatt."
					div.appendChild(howLateTimeP);
				}else{
					let participantname = document.createElement("p");
					participantname.innerText = "-noch keine Teilnehmer"
					participantsDiv.appendChild(participantname);
					div.appendChild(yourbidP);
					div.appendChild(bedInput);
					div.appendChild(howLateTimeP);
					div.appendChild(howLateTimeInput);
					div.appendChild(spacer);
					div.appendChild(submitButton);
				}
			}
		}
		submitButton.addEventListener("click", function(){
			placeBet(bet.id);
		}, false);
		if(account.rank == "admin"){
			let endeBetButton = document.createElement("button");
			endeBetButton.innerText = "end bet"
			endeBetButton.addEventListener("click", function(){
				endBet(bet.id);
			}, false);
			div.appendChild(endeBetButton);
		}
		div.appendChild(spacer2);
		activeBetsSectionNew.appendChild(div);
	});
}

function placeBet(betId){
	let inputMoney = parseInt(document.getElementById("bedInput"+ betId).value)
	let inputTime = parseInt(document.getElementById("howLateInput" + betId).value)
	if(inputMoney == NaN){
		alert("Bitte gebe nur Zahlen als Wettgeld an.")
	}else{
		if(inputTime == NaN){
			alert("Bitte gebe nur Zahlen als Verspätung an.")
		}else{
			if(inputMoney == 0){
				alert("Du kannst nicht 0€ wetten.")
			}else{
				if(inputTime == 0){
					alert("Du kannst nicht 0 Minuten verspätung angeben.")
				}else{
					if(inputTime > 0){
						if(inputMoney > 0){
							if(inputTime > 60){
								alert("Du kannst nicht mehr als 60 Minuten verspätung angeben.")
							}else{
								if(sendPostRequest(account.id + ";" + inputMoney.value,"checkBalance") == "true"){
									let betDiv = document.getElementById("betDiv" + betId);
									betDiv.removeChild(document.getElementById("bedInput"+ betId));
									betDiv.removeChild(document.getElementById("howLateInput"+ betId));
									betDiv.removeChild(document.getElementById("yourbidP" + betId));
									betDiv.removeChild(document.getElementById("howLateTimeP" + betId));
									betDiv.removeChild(document.getElementById("submitButton" + betId));
									let response = sendPostRequest(betId + ";" + account.id + ";" + inputMoney + ";" + inputTime, "enterBet");
									if(response == "false"){
										alert("Du kannst nicht die gleiche Verspätung wie andere Teilnehmer angeben.")
									}else{
										alert("Wette plaziert. " + response)
									}
								}else{
									alert("Du hast nicht genug Geld.")
								}
								document.location.reload() 
							}
						}else{
							alert("Du kannst nicht keine negativs Geld wetten.")
						}
					}else{
						alert("Du kannst keine negative verspätung angeben.")
					}
				}
			}
		}
	}
}