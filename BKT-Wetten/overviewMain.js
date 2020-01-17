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