const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const accounts = require("./public/js/accounts.js")["accounts"];
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let bets = [];
let accounts = [];

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/overview", (req, res) => {
  res.render("overview");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/createBet", (req, res) => {
  res.render("createBet");
});

app.post("/createBetPost",function(req,res){
  let data = req.body;
  data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2);
  data = data.split(";");
  let bet = {teacherName:data[0], startTime:data[1] , minBet:data[2], highestbidder:data[3], moneypool:data[4], participants:data[5],id:data[6]}
  bets.push(bet);
  console.log("created bet:")
  console.log(bet)
});

function getBed(bedId){
  let bed_;
  bets.forEach(bed => {
    if(bed.id == bedId){
      bed_ = bed
    }
  });
  return bed_;
}

function getAccount(accountId){
  let account_;
  accounts.forEach(account => {
    if(account.id == accountId){
      account_ = account
    }
  });
  return account_
}

function appendParticipantToBed(bedId, accountId){
  let bed = getBed(bedId);
  let account = getAccount(accountId);
  bed.participants = bed.participants + ";" + account.id
}

function addMoneyToBedPool(id , money){
  let bed = getBed(id);
  bed.moneypool = (parseInt(bed.moneypool) + parseInt(money)).toString()
  console.log("moneypool updated of id:" + bed.id);
  console.log("new moneypool:" + bed.moneypool); 
}

app.post("/enterBet",function(req,res){
  let data = req.body;
  data = JSON.stringify(data).replace("}", "").replace("{", "").replace('"', "").replace('""', "").slice(0, -2);
  data = data.split(";");
  console.log("Got bid entry:")
  console.log(data)
  let betId = data[0]
  let accountId = data[1]
  let biddedMoney = data[2]
  let lateTime = data[3]
  addMoneyToBedPool(betId, biddedMoney);
  appendParticipantToBed(betId, accountId);
});

app.get('/bets', function (req, res) {
  res.send(bets);
});

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});