const bodyParser = require("body-parser");
const express = require("express");
const sqlite3 = require("sqlite3");

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

// function createAccount(name, password, rank, money, callback){
//     let createAccountQuery = "INSERT INTO accounts(name,password,rank,money) VALUES (?,?,?,?)"
//     db.all(createAccountQuery, [name, password, rank, money], (err, rows) => {
//         if (err) {
//             console.error("[accountCreation]" + err.message);
//         }else{
//             callback(rows);
//         }
//     });
// }

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

function createBet(bet){
    createBetOnDatabase(bet.teacher, bet.startTime, bet.minBet, bet.moneyPool, bet.highestBet, bet.participants , function(rows){
        console.log("bet has been created.");
    });
    fetchDatabase();
}

let accounts = [];
let bets = [];

fetchDatabase();

//#endregion

const app = express();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.get('/bets', function (req, res) {
    fetchDatabase();
    res.send(bets);
});

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
            res.end("error");
        }else{
            res.end(queriedAccount.id + ";" + queriedAccount.name + ";" + queriedAccount.password + ";" + queriedAccount.rank + ";" + queriedAccount.money);
        }
    }else{
        res.end("error");
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
        //do partipipants hereTODO:finish this 
        
        respons = respons + "*" + bet.id + ";" + bet.teacher + ";" + bet.startTime + ";" + bet.minBet + ";" + bet.moneyPool + ";" + queriedAccount + ";" + bet.participants // id to account conversion needs to be done
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
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2).split(";")[0]; 
    let today = new Date();
    let time = today.getMinutes()
    let queriedBet;
    bets.forEach(bet => {
        if(bet.id == data)[
            queriedBet = bet
        ]
    });
    let participants = queriedBet.participants;
    participants = participants.split("_");
    let nearestParticipant = participants[1];
    participants.forEach(participant => {
        if(participant != ""){
            participant = participant.split(":");
            let currParticipantTimeDiff = parseInt(time) - parseInt(participant[2])
            let nearestParticipantTimeDiff = parseInt(time) - parseInt(nearestParticipant[2]) 
            if(currParticipantTimeDiff < nearestParticipantTimeDiff){
                nearestParticipant = participant
            }
        }
    });
    let queriedAccount;
    nearestParticipant = nearestParticipant.split(":");
    accounts.forEach(account => {
        if(account.name.toLowerCase() == nearestParticipant[0].toLowerCase()){
            queriedAccount = account
        }
    });
    updateAccountStats(queriedAccount.id, (parseInt(queriedAccount.wins) + 1).toString(), (parseInt(queriedAccount.moneyFromBets) + parseInt(queriedBet.moneyPool) * 2).toString());
    updateAccountMoney(queriedAccount.id, ((parseInt(queriedBet.moneyPool) * 2) + queriedAccount.money).toString());
    db.all("DELETE FROM bets WHERE id = '" + queriedBet.id + "'", [], (err, rows) => {
        if (err) {
            console.error("[DeleteBet]" + err.message);
        }
        else {
        }
    });
    res.end(nearestParticipant[0]);
});



app.post("/enterBet",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2);
    data = data.split(";");
    let betId = data[0]
    let accountId = data[1]
    let biddedMoney = data[2]
    let delayTime = data[3]//TODO: implement this

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
        let newParticipants = bet.participants + "_" + queriedAccount.name + ":" + biddedMoney + ":" + delayTime;
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

const server = app.listen(7000, () => {
    fetchDatabase();
    console.log(`Express running → PORT ${server.address().port}`);
});