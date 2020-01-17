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

    
    let getBetQuery = "SELECT * FROM bets ' WHERE id = '" + betId + "'"
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
        console.log(rows);
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
        accounts.forEach(account => {
            if(account.name.toLowerCase() == username.toLowerCase()){
                if(account.password == password){
                    res.end("logged in;" + account.id);
                }else{
                    res.end("incorrect password");
                }
            }else{
                res.end("there is no account with this username");
            }
        });
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
                if(account.id == bet.highestBet){
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

app.post("/enterBet",function(req,res){
    fetchDatabase();
    let data = req.body;
    data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2);
    data = data.split(";");
    let betId = data[0]
    let accountId = data[1]
    let biddedMoney = data[2]
    let delayTime = data[3]//TODO: implement this
    addParticipantToBet(betId, accountId, biddedMoney, delayTime, function(bet){
        console.log(bet);
        //to caolculating new things here
        let newMoneyPool = "123245678909";
        let newHighestBet = "error";
        let newParticipants = "error";
        console.log(betId);
        let addParticipantToBetQuery = "UPDATE bets SET 'moneyPool' = '" + newMoneyPool + "', 'highestBet' = '" + newHighestBet + "', 'participants' = '" + newParticipants + "' WHERE id = '" + betId + "'"
        db.all(addParticipantToBetQuery, [], (err, rows) => {
            if (err) {
                console.error("[addParticipantToBet]" + err.message);
            }else{
                
            }
        });
    });
    res.end("")
});

const server = app.listen(7000, () => {
    fetchDatabase();
    console.log(`Express running → PORT ${server.address().port}`);
});