const bodyParser = require("body-parser");
const express = require("express");
const sqlite3 = require("sqlite3");


const db = new sqlite3.Database("./data/database.db", (err) => {
    if (err) {
      console.error("[initializingDatabase]" + err.message);
    }
});


function fetchAccounts(){
    let accounts;
    db.all("SELECT * FROM accounts", [], (err, rows) => {
        if (err) {
            console.error("[fetchAccounts]" + err.message);
        }
        else {
            accounts = rows;
        }
    });
    return accounts;
}


function fetchBets(){
    let bets = []

    return bets
}

const app = express();
const accounts = fetchAccounts();
console.log(accounts);
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index");
});

const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

function createAccount(name, password, rank, money){
    let createAccountQuery = "INSERT INTO accounts(name,password,rank,money) VALUES (?,?,?,?)"
    db.all(createAccountQuery, [name, password, rank, money], (err, rows) => {
        if (err) {
            console.error("[accountCreation]" + err.message);
        }else{
            rows.forEach((row) => {
                console.log(row);
            });
        }
    });
}

// app.get("/overview", (req, res) => {
//   res.render("overview");
// });

// app.get("/profile", (req, res) => {
//   res.render("profile");
// });

// app.get("/createBet", (req, res) => {
//   res.render("createBet");
// });

// app.get('/bets', function (req, res) {
//     res.send(bets);
// });
  
// app.post("/createBetPost",function(req,res){
//   let data = req.body;
//   data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2);
//   data = data.split(";");
//   let bet = {teacherName:data[0], startTime:data[1] , minBet:data[2], highestbidder:data[3], moneypool:data[4], participants:data[5],id:data[6]}
//   bets.push(bet);
//   console.log("created bet:")
//   console.log(bet)
// });

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


// function getBed(bedId){
//   let bed_;
//   bets.forEach(bed => {
//     if(bed.id == bedId){
//       bed_ = bed
//     }
//   });
//   return bed_;
// }

// function getAccount(accountId){
//   let account_;
//   accounts.forEach(account => {
//     if(account.id == accountId){
//       account_ = account
//     }
//   });
//   return account_
// }

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

