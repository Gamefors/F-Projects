
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

function endBet(betId){
	let response = sendPostRequest(betId,"endBet").split(";");
	alert(response[0] + " hat mit " + response[2] + " Minuten verspätung und " + response[1] + "€ Einsatz gewonnen.");
	document.location.reload();
}

function gotoStats(){
	window.location.href = "/stats"
}

function gotoCreateBet(){
	window.location.href = "/createBet"
}

function gotoAdminPanel(){
	window.location.href = "/adminPanel"
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

function refreshBets(){//TODO: remove later when reload is issued by server everytime a user enters the bet or it ends.
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
		let participants = []
		let tempList = bet.participants.split("/");
		tempList.shift();
		tempList.forEach(tempParticipant => {
			tempParticipant = tempParticipant.split(":");
			participants.push({name:tempParticipant[0], biddedMoney:tempParticipant[1], delayTime:tempParticipant[2]});
		});
		let div = document.createElement("div");
		let teacherName = document.createElement("p");
		let startTime = document.createElement("p");
		let participantsP = document.createElement("p");
		let participantListDiv = document.createElement("p");
		let yourbidP = document.createElement("p");
		let bedInput = document.createElement("input");
		let howLateTimeP = document.createElement("p");
		let howLateTimeInput = document.createElement("input");
		let spacer = document.createElement("p");
		let submitButton = document.createElement("button");
		div.setAttribute("id", "betDiv" + bet.id);
		yourbidP.setAttribute("id", "yourbidP" + bet.id);
		bedInput.setAttribute("id", "bedInput" + bet.id);
		howLateTimeP.setAttribute("id", "howLateTimeP" + bet.id);
		howLateTimeInput.setAttribute("id", "howLateInput" + bet.id);
		submitButton.setAttribute("id", "submitButton" + bet.id);
		
		teacherName.innerText = "Lehrer Name: " + bet.teacher
		startTime.innerText = "Unterrichtsstunde startet um: " + bet.startTime
		participantsP.innerText = "Teilnehmer: "
		submitButton.innerText = "Wette abgeben."
		howLateTimeP.innerText = "Verspätung in Minuten:"
		yourbidP.innerText = "Einsatz in €: "
		
		div.appendChild(teacherName);
		div.appendChild(startTime);
		div.appendChild(participantsP);
		div.appendChild(participantListDiv);

		let today = new Date();
		let currMins = parseInt(today.getMinutes())
		let currHours = parseInt(today.getHours())
		let betMins = parseInt(bet.startTime.split(":")[1])
		let betHours = parseInt(bet.startTime.split(":")[0])

		if(participants.length > 0){
			let placedBet = false
			participants.forEach(participant => {
				if(participant.name.toLowerCase() == account.name.toLowerCase()){
					placedBet = true
				}
				let participantname = document.createElement("p");
				participantname.innerText = "• " + participant.name + " mit " + participant.biddedMoney + "€" + " verspätung: " + participant.delayTime + " Minuten."
				participantListDiv.appendChild(participantname);
			});
			if(placedBet == false){
				if(currHours <= betHours){
					if(currMins <= betMins){
						div.appendChild(yourbidP);
						div.appendChild(bedInput);
						div.appendChild(howLateTimeP);
						div.appendChild(howLateTimeInput);
						div.appendChild(spacer);
						div.appendChild(submitButton);
					}else{
						howLateTimeP.innerText = "Es können keine Wetten mehr plaziert werden da die Stunde angefangen hatt."
						div.appendChild(howLateTimeP);
					}
				}else{
					howLateTimeP.innerText = "Es können keine Wetten mehr plaziert werden da die Stunde angefangen hatt."
					div.appendChild(howLateTimeP);
				}
			}else{
				howLateTimeP.innerText = "Die Wette wurde geschlossen."
				div.appendChild(howLateTimeP);
			}
		}else{
			if(currHours <= betHours){
				if(currMins <= betMins){
					div.appendChild(yourbidP);
					div.appendChild(bedInput);
					div.appendChild(howLateTimeP);
					div.appendChild(howLateTimeInput);
					div.appendChild(spacer);
					div.appendChild(submitButton);
				}else{
					howLateTimeP.innerText = "Es können keine Wetten mehr plaziert werden da die Stunde angefangen hatt."
					div.appendChild(howLateTimeP);
				}
			}else{
				howLateTimeP.innerText = "Es können keine Wetten mehr plaziert werden da die Stunde angefangen hatt."
				div.appendChild(howLateTimeP);
			}
		}


///////////////////////////////////////////////////////////////
		submitButton.addEventListener("click", function(){
			placeBet(bet.id);
		}, false);
		if(account.rank == "admin"){
			let endeBetButton = document.createElement("button");
			endeBetButton.innerText = "end bet"
			endeBetButton.addEventListener("click", function(){
				endBet(bet.id);
			}, false);
			let spacer2 = document.createElement("p");
			div.appendChild(spacer2);
			div.appendChild(endeBetButton);
		}
		activeBetsSectionNew.appendChild(div);
	});
}
//////////////////////////////////////////////////////////////////

let loggedIn = window.localStorage.getItem("loggedIn");
let accountId = window.localStorage.getItem("accountId");
let account = null;
let bets = null;

if(loggedIn == null){
	alert("you are not logged in.")
	localStorage.clear();
	window.location.href = "/"
}else{
	let logoutProfileButton = document.getElementById("logoutProfileButton");
	let refreshBetsButton = document.getElementById("refreshBetsButton");
	let statsButton = document.getElementById("statsButton");
	logoutProfileButton.addEventListener("click", logout, false);
	refreshBetsButton.addEventListener("click", refreshBets, false);
	statsButton.addEventListener("click", gotoStats, false);
	account = getAccount(accountId);
	bets = getBets();
	document.getElementById("overviewProfileId").innerText = "Id: " + account.id
	document.getElementById("overviewProfileName").innerText = "Name: " + account.name
	document.getElementById("overviewProfileRank").innerText = "Rang: " + account.rank
	document.getElementById("overviewProfileMoney").innerText = "Geld: " + account.money + "€"
	if(account.rank == "admin"){
		let createBetButton = document.createElement("button");
		let profileSection = document.getElementById("profile");
		let gotoAdminPanelButton = document.createElement("button");
		createBetButton.innerText = "Neue Wette erstellen"
		gotoAdminPanelButton.innerText = "Admin Panel"
		createBetButton.addEventListener("click", gotoCreateBet, false);
		gotoAdminPanelButton.addEventListener("click", gotoAdminPanel, false);
		profileSection.appendChild(createBetButton);
		profileSection.appendChild(document.createElement("p"));
		profileSection.appendChild(gotoAdminPanelButton);
	}
	createActiveBets(bets)
}