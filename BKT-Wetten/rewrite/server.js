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

function createAccount(name, password, rank, money, callback){
    let createAccountQuery = "INSERT INTO accounts(name,password,rank,money) VALUES (?,?,?,?)"
    db.all(createAccountQuery, [name, password, rank, money], (err, rows) => {
        if (err) {
            console.error("[accountCreation]" + err.message);
        }else{
            callback(rows);
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
    console.log(bets);
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

const server = app.listen(7000, () => {
    fetchDatabase();
    console.log(`Express running → PORT ${server.address().port}`);
});



// app.post("/enterBet",function(req,res){
//     let data = req.body;
//     data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2);
//     data = data.split(";");
//     console.log("Got bid entry:")
//     console.log(data)
//     let betId = data[0]
//     let accountId = data[1]
//     let biddedMoney = data[2]
//     let lateTime = data[3]
//     addMoneyToBedPool(betId, biddedMoney);
//     appendParticipantToBed(betId, accountId);
// });

// function appendParticipantToBed(bedId, accountId){
//   let bed = getBed(bedId);
//   let account = getAccount(accountId);
//   bed.participants = bed.participants + ";" + account.id
// }

// function addMoneyToBedPool(id , money){
//   let bed = getBed(id);
//   bed.moneypool = (parseInt(bed.moneypool) + parseInt(money)).toString()
//   console.log("moneypool updated of id:" + bed.id);
//   console.log("new moneypool:" + bed.moneypool); 
// }