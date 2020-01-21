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
    let data = JSON.stringify(req.body).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";")[0]; 
    let queriedBet;
    bets.forEach(bet => {
        if(bet.id == data)[
            queriedBet = bet
        ]
    });
    let participants = queriedBet.participants.split("/")
    participants.shift();
    let tempParticipants = []
    participants.forEach(participant => {
        participant = participant.split(":");
        let tempParticipant = {name:participant[0], biddedMoney:participant[1], delayTime:participant[2]}
        tempParticipants.push(tempParticipant)
    });
    participants = tempParticipants
    let nearestParticipant = participants[0];
    console.log("[endBet] Ending bet with id: " + queriedBet.id);
    console.log("[endBet] Participants:");
    participants.forEach(participant => {
        console.log("[endBet] " + participant.name + " mit " + participant.biddedMoney + "€ und " + participant.delayTime + " Minuten verspätung.")
        
    });
    console.log("[endBet] Currently winning participant: " + nearestParticipant.name);
    
    let today = new Date();
    let time = today.getMinutes()
    
    let winners = []
    
    participants.forEach(participant => {
        let currParticipantTimeDiff = parseInt(time) - parseInt(participant.delayTime)
        let nearestParticipantTimeDiff = parseInt(time) - parseInt(nearestParticipant.delayTime) 
        console.log("[winnerEvalutation] Current participant: " + participant.name + " mit " + participant.delayTime + " Minuten verspätung. Zeit Differentz: " + currParticipantTimeDiff)
        console.log("[winnerEvalutation] Nearest/Winner participant: " + nearestParticipant.name + " mit " + nearestParticipant.delayTime + " Minuten verspätung. Zeit Differentz: " + nearestParticipantTimeDiff)
        
        if(currParticipantTimeDiff < nearestParticipantTimeDiff){
            if(parseInt(time) <= 30){
                nearestParticipant = participant
                console.log("[endBet] New winning participant: " + nearestParticipant.name); 
            }
        }else if(currParticipantTimeDiff == nearestParticipantTimeDiff){
            if(nearestParticipant != participant){
                winners.push(participant);
                console.log("[WinnerEvaluation] Added new winning participant because of same delayTime: " + participant.name);
            }
        }else{
            if(parseInt(time) >= 30){
                nearestParticipant = participant
                console.log("[endBet] New winning participant: " + nearestParticipant.name); 
            }
        }
    });
    winners.push(nearestParticipant);
    console.log("[endBet] Final winners:");
    winners.forEach(participant => {
        console.log("[endBet] " + participant.name + " mit " + participant.biddedMoney + "€ und " + participant.delayTime + " Minuten verspätung.")
        
    });
    nearestParticipant = winners[Math.floor(Math.random() * winners.length)]
    console.log("[endBet] Final winning participant: " + nearestParticipant.name);
    let queriedAccount;
    accounts.forEach(account => {
        if(account.name.toLowerCase() == nearestParticipant.name.toLowerCase()){
            queriedAccount = account
        }
    });
    
    updateAccountStats(queriedAccount.id, (parseInt(queriedAccount.wins) + 1).toString(), (parseInt(queriedAccount.moneyFromBets) + parseInt(queriedBet.moneyPool) * 2).toString());
    
    updateAccountMoney(queriedAccount.id, ((parseInt(queriedBet.moneyPool) * 2) + parseInt(queriedAccount.money)).toString());

    db.all("DELETE FROM bets WHERE id = '" + queriedBet.id + "'", [], (err, rows) => {
        if (err) {
            console.error("[endBet/SqLite]" + err.message);
        }
        else {
            console.log("[endBet/SqLite] Deleted bet with id: " + queriedBet.id)
        }
    });
    res.end(nearestParticipant.name + ";" + nearestParticipant.biddedMoney + ";" + nearestParticipant.delayTime);
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
    res.end("")
});

//#endregion

//starting express server
const server = app.listen(7000, () => {
    
    //fetching sqlite database
    fetchDatabase();

    console.log("Started express server on port: " + server.address().port);

});