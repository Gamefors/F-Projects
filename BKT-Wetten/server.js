//TODO: normalize numbers either strings or ints 
//#region require

const bodyParser = require("body-parser");
const express = require("express");
const sqlite3 = require("sqlite3");

//#endregion

//#region express

//creating express server
const app = express();

//setting express view engine
app.set("view engine", "pug");

//express app settings
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//#endregion

//#region sqlLite
const db = new sqlite3.Database("./data/database.db", (err) => {
    if (err) {
      console.error("[initializingDatabase]" + err.message);
    }
});

function fetchAccounts(callback){
    db.all("SELECT * FROM accounts", [], (err, rows) => {
        if (err) {
            console.error("[fetchAccounts]" + err.message);
        }
        else {
            callback(rows);
        }
    });
}

function fetchBets(callback){
    db.all("SELECT * FROM bets", [], (err, rows) => {
        if (err) {
            console.error("[fetchBets]" + err.message);
        }
        else {
            callback(rows);
        }
    });
}

function fetchDatabase(){
    fetchAccounts(function(rows) {
        accounts = rows
    });
    
    fetchBets(function(rows) {
        bets = rows
    });
}

function deleteBet(betId){
    db.all("DELETE FROM bets WHERE id = '" + betId + "'", [], (err, rows) => {
        if (err) {
            console.error("[deleteBet/SqLite]" + err.message);
        }
        else {
            console.log("[deleteBet/SqLite] Deleted bet with id: " + betId)
        }
    });
}

function createAccount(name, password){
    let createAccountQuery = "INSERT INTO accounts(name,password,rank,money,wins,moneyFromBets) VALUES (?,?,?,?,?,?)"
    db.all(createAccountQuery, [name.toLowerCase(), password, "user", "500", "0", "0"], (err, rows) => {
        if (err) {
            console.error("[accountCreation]" + err.message);
        }else{
            console.log("[accountCreation] created new account: Name: " + name + " Password: " + password)
        }
    });
}

function deleteAccount(id){
    let createAccountQuery = "DELETE FROM accounts WHERE id = '" + id + "'"
    db.all(createAccountQuery, [], (err, rows) => {
        if (err) {
            console.error("[accountDeletion]" + err.message);
        }else{
            console.log("[accountDeletion] deleted account with id: " + id);
        }
    });
}

function createBetOnDatabase(teacher, startTime, minBet, moneyPool, highestBet, participants, callback){
    let createBetQuery = "INSERT INTO bets(teacher,startTime,minBet,moneyPool,highestBet,participants) VALUES (?,?,?,?,?,?)"
    db.all(createBetQuery, [teacher, startTime, minBet, moneyPool, highestBet, participants], (err, rows) => {
        if (err) {
            console.error("[BetCreation]" + err.message);
        }else{
            callback(rows);
        }
    });
    fetchDatabase();
}

function updateAccountStats(accountId, newWins, newMoneyFromBets){
    let updateAccountMoneyQuery = "UPDATE accounts SET wins = '" + newWins + "', moneyFromBets = '" + newMoneyFromBets + "' WHERE id = '" + accountId + "'"
    db.all(updateAccountMoneyQuery, [], (err, rows) => {
        if (err) {
            console.error("[updateAccountStats]" + err.message);
        }else{
            
        }
    });
    fetchDatabase();
}

function updateAccountMoney(accountId, newBalance){
    let updateAccountMoneyQuery = "UPDATE accounts SET money = '" + newBalance + "' WHERE id = '" + accountId + "'"
    db.all(updateAccountMoneyQuery, [], (err, rows) => {
        if (err) {
            console.error("[updateAccountMoney]" + err.message);
        }else{
            
        }
    });
    fetchDatabase();
}

function addParticipantToBet(betId, accountId, biddedMoney, delayTime, callback){
    let queriedAccount;
    accounts.forEach(account => {
        if(account.id == accountId){
            queriedAccount = account
        }
    });
    let newAccountBalance = queriedAccount.money - biddedMoney 
    updateAccountMoney(accountId, newAccountBalance);
    fetchDatabase();

    let getBetQuery = "SELECT * FROM bets WHERE id = '" + betId + "'"
    db.all(getBetQuery, [], (err, rows) => {
        if (err) {
            console.error("[addParticipantToBet]" + err.message);
        }else{
            callback(rows);
        }
    });    

    
    fetchDatabase();
}

function checkIfNameExists(name, callback){
    let lowerCaseName = name.toLowerCase();
    let checkIfNameExistsQuery = "SELECT * FROM accounts WHERE name = '" + lowerCaseName + "'"
    db.all(checkIfNameExistsQuery, [], (err, rows) => {
        if (err) {
            console.error("[checkIfNameExists]" + err.message);
        }else{
            callback(rows);
        }
    });    
    fetchDatabase();
}


function createBet(bet){
    createBetOnDatabase(bet.teacher, bet.startTime, bet.minBet, bet.moneyPool, bet.highestBet, bet.participants , function(rows){
        console.log("[betCreation] New bet with attributes: \n" + JSON.stringify(bet) + "\nhas been created.");
    });
    fetchDatabase();
}

let accounts = [];
let bets = [];

fetchDatabase();

//#endregion

//#region extra functions 

function evaluateBetWinner(participants, queriedBet, res){
    if(participants.length == 1){
        //setting the first one of the list because there is no other
        let winner = participants[0];
        //query the account of the winner
        let queriedWinnerAccount;
        accounts.forEach(account => {
            if(account.name.toLowerCase() == winner.name.toLowerCase()){
                queriedWinnerAccount = account
            }
        });
       
       
        //update the account stats TODO: check if moneyFromBets works corectly (WINS do work corretly)
        updateAccountStats(queriedWinnerAccount.id, (parseInt(queriedWinnerAccount.wins) + 1).toString(), ((parseInt(queriedBet.moneyPool) * 2) + parseInt(queriedWinnerAccount.moneyFromBets)).toString());
        console.log("[DEBUG] " + (parseInt(queriedBet.moneyPool) * 2).toString() + " has been added to the winners stats as moneyFromBets.");
        //add the price money to existing account money TODO: test why it sometimes is NaNd or why it doesnt work correctly
        updateAccountMoney(queriedWinnerAccount.id, ((parseInt(queriedBet.moneyPool) * 2) + parseInt(queriedWinnerAccount.money)).toString());
        console.log("[DEBUG] " + (parseInt(queriedBet.moneyPool) * 2).toString() + " has been added to the winners account.");
        
        
        //delete bet from sqlite database
        deleteBet(queriedBet.id);
        //send winner back to website
        res.end(queriedWinnerAccount.name + ";" + winner.biddedMoney + ";" + winner.delayTime); 
    }else{
        //getting the current time
        let today = new Date();
        let stoppedAtMinutes = parseInt(today.getMinutes())
        let stoppedAtHours = today.getHours()
        //get the lessonTime
        let lessonStartTime = queriedBet.startTime.split(":");
        let lessonStartTimeHours = lessonStartTime[0];
        let lessonStartTimeMinutes = lessonStartTime[1];
        //setting the first one of the list as the default winner if there are no other participants or noe one is closer to the delayTime
        let winner = participants[0];
//####################################################################################################################################################################################################
        participants.forEach(participant => {
            
            let participantDelay = parseInt(participant.delayTime)
            let winnerDelay = parseInt(winner.delayTime)

            if((stoppedAtMinutes + participantDelay) > 60){
                if((stoppedAtMinutes + winnerDelay) > 60){
                    let participantNewDelayTimeInNewHour = (stoppedAtMinutes + participantDelay) - 60
                    let winnerNewDelayTimeInNewHour = (stoppedAtMinutes + winnerDelay) - 60
                    let participantTimeDifference = (stoppedAtMinutes - participantNewDelayTimeInNewHour)
                    let winnerTimeDifference = (stoppedAtMinutes - winnerNewDelayTimeInNewHour)
                    if(participantTimeDifference > winnerTimeDifference){
                        console.log("[DEBUG] 1 old Winner = " + winner + " new Winner: " + participant)
                        winner = participant
                    }
                }
            }else{
                if((stoppedAtMinutes + winnerDelay) > 60){
                    if((parseInt(stoppedAtMinutes) + parseInt(participantDelay)) > 60){
                        let participantNewDelayTimeInNewHour = (stoppedAtMinutes + participantDelay) - 60
                        let winnerNewDelayTimeInNewHour = (stoppedAtMinutes + winnerDelay) - 60
                        let participantTimeDifference = (stoppedAtMinutes - participantNewDelayTimeInNewHour)
                        let winnerTimeDifference = (stoppedAtMinutes - winnerNewDelayTimeInNewHour)
                        if(participantTimeDifference > winnerTimeDifference){
                            console.log("[DEBUG] 2 old Winner = " + winner + " new Winner: " + participant)
                            winner = participant
                        }
                    }else{
                        console.log("[DEBUG] 3 old Winner = " + winner + " new Winner: " + participant)
                        winner = participant
                    }
                }else{
                    let participantTimeDifference = (stoppedAtMinutes - participantDelay)
                    let winnerTimeDifference = (stoppedAtMinutes - winnerDelay)
                    if(participantTimeDifference > winnerTimeDifference){
                        console.log("[DEBUG] 4 old Winner = " + winner + " new Winner: " + participant)
                        winner = participant
                    }
                }
            }
        });
//####################################################################################################################################################################################################
        //query the account of the winner
        let queriedWinnerAccount;
        accounts.forEach(account => {
            if(account.name.toLowerCase() == winner.name.toLowerCase()){
                queriedWinnerAccount = account
            }
        });
        //update the account stats TODO: check if moneyFromBets works corectly (WINS do work corretly)
        updateAccountStats(queriedWinnerAccount.id, (parseInt(queriedWinnerAccount.wins) + 1).toString(), (parseInt(queriedWinnerAccount.moneyFromBets) + parseInt(queriedBet.moneyPool) * 2).toString());
        console.log("[DEBUG] " + (parseInt(queriedWinnerAccount.moneyFromBets) + parseInt(queriedBet.moneyPool) * 2).toString() + " has been added to the winners stats as moneyFromBets.");
        //add the price money to existing account money TODO: test why it sometimes is NaNd or why it doesnt work correctly
        updateAccountMoney(queriedWinnerAccount.id, ((parseInt(queriedBet.moneyPool) * 2) + parseInt(queriedWinnerAccount.money)).toString());
        console.log("[DEBUG] " + (parseInt(queriedWinnerAccount.moneyFromBets) + parseInt(queriedBet.moneyPool) * 2).toString() + " has been added to the winners account.");
        
        console.log("[DEBUG] winner is " + queriedWinnerAccount.name + " mit " + winner.delayTime + " Minuten verspätung.");
        
        //delete bet from sqlite database
        deleteBet(queriedBet.id);
        //send winner back to website
        res.end(queriedWinnerAccount.name + ";" + winner.biddedMoney + ";" + winner.delayTime); 
        }
}

//#endregion

//#region get

app.get("/", (req, res) => {
  fetchDatabase();
  res.render("index");
});

app.get("/stats", (req, res) => {
    fetchDatabase();
    res.render("stats");
  });

app.get("/overview", (req, res) => {
    fetchDatabase();
    res.render("overview");
});

app.get("/createBet", (req, res) => {
    fetchDatabase();
    res.render("createBet");
});

app.get('/register', function (req, res) {
    fetchDatabase();
    res.render("register");
});

app.get('/adminPanel', function (req, res) {
    fetchDatabase();
    res.render("adminPanel");
});

//#endregion

//#region post

app.post("/login",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";")[0];
    if(data != "."){
        data = data.split(".");
        let username = data[0]
        let password = data[1]
        let account;
        accounts.forEach(account_ => {
            if(account_.name.toLowerCase() == username.toLowerCase()){
                account = account_
            }
        });
        if(account == undefined){
            res.end("there are no accounts in the database.")
        }else{
            if(account.name.toLowerCase() == username.toLowerCase()){
                if(account.password == password){
                    res.end("logged in;" + account.id);
                    console.log("[login] account with name: " + account.name + " logged in.");
                }else{
                    res.end("incorrect password");
                }
            }else{
                res.end("there is no account with this username");
            }
        }
    }else{
        res.end("no login credentials were given");
    }
});

app.post("/getAccount",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";")[0];
    if(data != ""){
        let accountId = data
        let queriedAccount;
        accounts.forEach(account => {
            if(account.id == accountId){
                queriedAccount = account
            }
        });
        if(queriedAccount == undefined){
            res.end("ERROR");
        }else{
            res.end(queriedAccount.id + ";" + queriedAccount.name + ";" + queriedAccount.password + ";" + queriedAccount.rank + ";" + queriedAccount.money);
        }
    }else{
        res.end("ERROR");
    }
});

app.post("/createAccount",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";")[0];
    if(data != ""){
        data = data.split(".");
        checkIfNameExists(data[0], function(result){
            if(result.length == 0){
                createAccount(data[0], data[1]);
                res.end("true");
            }else{
                res.end("Ein Account mit diesem Namen existiert bereits.");
            }
        });
    }else{
        res.end("[ERROR] no data was given");
    }
});

app.post("/deleteAccount",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";")[0];
    if(data != ""){
        deleteAccount(data);
        res.end("Account was deleted.")
    }else{
        res.end("[ERROR] no data was given");
    }
});

app.post("/getAccountStats",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";")[0];
    if(data != ""){
        let accountId = data
        let queriedAccount;
        accounts.forEach(account => {
            if(account.id == accountId){
                queriedAccount = account
            }
        });
        if(queriedAccount == undefined){
            res.end("ERROR");
        }else{
            res.end(queriedAccount.wins + ";" + queriedAccount.moneyFromBets);
        }
    }else{
        res.end("ERROR");
    }
});

app.post("/getAccountByName",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";")[0];
    if(data != ""){
        data = data.split(":");
        let accountName = data[0]
        let queriedAccount;
        accounts.forEach(account => {
            if(account.name.toLowerCase() == accountName.toLowerCase()){
                queriedAccount = account
            }
        });
        res.end(queriedAccount.id + ";" + queriedAccount.name + ";" + queriedAccount.password + ";" + queriedAccount.rank + ";" + queriedAccount.money);
    }else{
        res.end("error");
    }
});

app.post("/createBet",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2);
    data = data.split(";");
    let bet = {teacher:data[0], startTime:data[1] , minBet:data[2], highestBet:data[3], moneyPool:data[4], participants:data[5]}
    createBet(bet);
    res.end("created bet.");
});

app.post("/getBets",function(req,res){
    fetchDatabase();
    let respons = "";
    
    bets.forEach(bet => {
        let queriedAccount = "niemand";
        if(bet.highestBet != ""){
            accounts.forEach(account => {
                let highestBetter = bet.highestBet.split(":");
                if(account.name.toLowerCase() == highestBetter[0].toLowerCase()){
                    queriedAccount = account
                    queriedAccount = queriedAccount.name
                }
            });
        }
        respons = respons + "*" + bet.id + ";" + bet.teacher + ";" + bet.startTime + ";" + bet.minBet + ";" + bet.moneyPool + ";" + queriedAccount + ";" + bet.participants
    });
    respons = respons.substr(1);
    res.end(respons);
});

app.post("/getAccounts",function(req,res){
    fetchDatabase();
    let respons = "";
    accounts.forEach(account => {
        respons = respons + "*" + account.id + ";" + account.name + ";" + account.password + ";" + account.rank + ";" + account.money + ";" + account.wins + ";" + account.moneyFromBets
    });
    respons = respons.substr(1);
    res.end(respons);
});

app.post("/checkBalance",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";"); 
    let accountId = data[0]
    let money = data[1]
    let queriedAccount;
    accounts.forEach(account => {
        if(account.id == accountId){
            queriedAccount = account
        }
    });
    let newBalance = parseInt(queriedAccount.money) - parseInt(money)
    if(newBalance < 0){
        res.end("false");
    }else{
        res.end("true");
    }
});

app.post("/endBet",function(req,res){
    //getting Id of the bet that should end
    let idOfEndingBet = JSON.stringify(req.body).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";")[0]
    let queriedBet = "no bet was queried";
    bets.forEach(bet => {
        if(bet.id == idOfEndingBet){
            queriedBet = bet
        }
    });
    console.log("[endBet] Beende Wette mit der Id: " + queriedBet.id);
    //get the participants of the bet that should end
    let participants = queriedBet.participants.split("/");
    participants.shift();
    //creating a participant object and replace old list with these new participant objects
    let tempList = []
    participants.forEach(participant => {
        participant = participant.split(":");
        let tempParticipant = {name:participant[0], biddedMoney:participant[1], delayTime:participant[2]}
        tempList.push(tempParticipant)
    });
    participants = tempList
    //check if there are participants to check for a winner
    if(participants.length == 0){
        res.end("Kein Gewinner da niemand teilgenommen hat.")
        //delete bet from sqlite database
        deleteBet(queriedBet.id);
    }else{
        //displaying potential winners for debbuging reasons
        console.log("[endBet] Potenzielle Gewinner:");
        participants.forEach(participant => {
            console.log("[endBet] " + participant.name + " mit " + participant.biddedMoney + "€ und " + participant.delayTime + " Minuten verspätung.")
        });
        //pass evaluation of winner to a function
        evaluateBetWinner(participants, queriedBet, res);
    }
}); 

app.post("/enterBet",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2);
    data = data.split(";");
    let betId = data[0]
    let accountId = data[1]
    let biddedMoney = data[2]
    let delayTime = data[3]
    
    let queriedBet = "no bet was queried";
    bets.forEach(bet => {
        if(bet.id == betId){
            queriedBet = bet
        }
    });
    let numbers = [];
    let participants = queriedBet.participants.split("/");
    participants.shift();
    participants.forEach(participant => {
        participant = participant.split(":");
        numbers.push(participant[2])
    });
    
    if(numbers.includes(delayTime)){
        res.end("false");
    }else{
        addParticipantToBet(betId, accountId, biddedMoney, delayTime, function(bet_){
            fetchDatabase();
            let bet = bet_[0]
            let queriedAccount;
            accounts.forEach(account => {
                if(account.id == accountId){
                    queriedAccount = account
                }
            });
            let newMoneyPool = (parseInt(bet.moneyPool) + parseInt(biddedMoney)).toString();
            let newParticipants = bet.participants + "/" + queriedAccount.name + ":" + biddedMoney + ":" + delayTime;
            let newHighestBet = "error:error";
            let newParticipantsList = newParticipants.split(";");
            newParticipantsList.forEach(participant => {
                let newHighestBetInt = parseInt(newHighestBet.split(":")[1]);
                participant = participant.split(":");
                    if(newHighestBetInt < parseInt(participant[1])){
                        newHighestBet = participant[0] + " mit " + participant[1]
                    }
            });
            fetchDatabase();
            let addParticipantToBetQuery = "UPDATE bets SET 'moneyPool' = '" + newMoneyPool + "', 'highestBet' = '" + newHighestBet + "', 'participants' = '" + newParticipants + "' WHERE id = '" + betId + "'"
            db.all(addParticipantToBetQuery, [], (err, rows) => {
                if (err) {
                    console.error("[addParticipantToBetCallback]" + err.message);
                }else{

                }
            });
        });
        let queriedAccount;
        accounts.forEach(account => {
            if(account.id == accountId){
                queriedAccount = account
            }
        });
        updateAccountMoney(queriedAccount.id, (parseInt(queriedAccount.money) - parseInt(biddedMoney)).toString());
        res.end("");
    }
});

//#endregion

//starting express server
const server = app.listen(7000, () => {
    
    //fetching sqlite database
    fetchDatabase();

    console.log("Started express server on port: " + server.address().port);

});