const express = require("express");
const dbo = require("../db/conn");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const checkBlacklist = function(req, res, next) {
  // console.log("Testing!");
  let blacklist = ["2.58.56.101","5.226.139.227","23.129.64.210","23.129.64.211","23.129.64.218","23.129.64.221","23.129.64.227","23.137.251.61","24.120.111.152","37.252.254.33","45.134.225.36","45.139.122.241","45.154.98.33","47.40.18.182","51.89.153.112","51.195.166.195","66.176.58.226","68.238.247.112","69.250.200.141","80.67.167.81","82.223.14.245","84.239.46.144","89.234.157.254","92.205.129.7","92.246.84.133","94.230.208.147","95.214.52.187","95.214.55.43","99.64.179.128","103.251.167.10","103.251.167.20","103.251.167.21","104.192.3.74","104.244.79.40","107.141.13.242","107.152.217.4","107.189.2.91","107.189.6.124","107.189.7.185","107.189.30.22","109.70.100.20","109.70.100.23","109.70.100.24","109.70.100.25","109.70.100.31","109.70.100.32","109.70.100.35","109.70.100.75","109.70.100.77","109.70.100.78","109.70.100.79","109.70.100.80","109.70.100.81","142.44.170.136","162.247.73.192","171.25.193.79","171.25.193.80","173.225.109.92","178.175.135.7","185.14.97.176","185.56.83.83","185.100.85.23","185.100.85.25","185.100.87.139","185.100.87.174","185.100.87.238","185.107.70.56","185.129.61.129","185.129.62.63","185.181.61.23","185.195.71.3","185.195.71.244","185.195.232.156","185.220.100.240","185.220.100.241","185.220.100.242","185.220.100.243","185.220.100.244","185.220.100.245","185.220.100.246","185.220.100.247","185.220.100.248","185.220.100.249","185.220.100.250","185.220.100.251","185.220.100.252","185.220.100.253","185.220.100.254","185.220.100.255","185.220.101.1","185.220.101.2","185.220.101.4","185.220.101.5","185.220.101.6","185.220.101.8","185.220.101.14","185.220.101.15","185.220.101.21","185.220.101.25","185.220.101.30","185.220.101.31","185.220.101.35","185.220.101.36","185.220.101.37","185.220.101.47","185.220.101.48","185.220.102.241","185.220.102.242","185.220.102.244","185.220.102.245","185.220.102.247","185.220.102.248","185.220.102.249","185.220.102.253","185.220.103.116","185.220.103.120","185.235.146.29","185.243.218.27","185.243.218.46","185.243.218.55","185.243.218.78","185.243.218.89","185.243.218.110","185.246.188.60","185.246.188.67","185.246.188.74","192.42.116.16","193.142.146.213","193.239.232.102","194.26.192.186","194.32.107.60","195.176.3.24","204.186.126.109","205.185.116.34","212.21.66.6","212.102.44.67","212.227.115.239"];
  let ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] ||req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(ip);
  if(blacklist.includes(ip)){
    // Invalid ip
    // console.log("Bad IP: " + ip);
    const err = new Error("Bad IP: " + ip);
    next(err);
  }
  else{
    // IP is ok, so go on
    console.log("IP ok");
    next();
  }
}
app.use(checkBlacklist);
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send("Your IP is Blocked!");
});
const rateLimit = require('express-rate-limit')
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const reserveRoutes = express.Router();


// This will help us connect to the database
// This help convert the id from string to ObjectId for the _id.
//const ObjectId = require("mongodb").ObjectId;
// This section will help you get a single record by id
// const limiter = rateLimit({
// 	windowMs: 1 * 60 * 1000,
// 	max: 100, 
// 	standardHeaders: true, 
// 	legacyHeaders: false, 
// }) 
// reserveRoutes.use(limiter)

reserveRoutes.route("/api/records/:id").get( async function (req, res) {
  await dbo.connectToServer(function(err){
    let db_connect = dbo.getDb("worldcup22");
    let myquery = { matchNumber: Number(req.params.id) };
    db_connect
      .collection("shopMasterlist")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  })
 
});

reserveRoutes.route("/api/tickets/:id").get( async function (req, res) {
  await dbo.connectToServer(function(err){
    let db_connect = dbo.getDb("worldcup22");
    let myquery = { matchNumber: Number(req.params.id) };
    db_connect
      .collection("Reservations")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  })
 
});
reserveRoutes.route("/api/records").get( async function (req, res) {
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
    let db_connect = dbo.getDb("worldcup22");
    db_connect.collection("shopMasterlist").find({})
      .toArray(function (err, result) {
        if (err) throw err;
        console.log("get request in record")
        res.json(result);
      });
  });
  
  //res.send("problem in db")
 });
// This section will help you create a new record.
reserveRoutes.route("/api/matches").post( async function (req, response) {
  await dbo.connectToServer(function(err){
    if(err) console.error(err);
    let db_connect = dbo.getDb("worldcup22");
    mno=Number(req.body.matchNumber)
    image=""
    switch(mno){
     case 1:image="https://i.imgur.com/eNujwQS.png"; break;
     case 2:image="https://i.imgur.com/hZeLGAX.png"; break;
     case 3:image="https://i.imgur.com/9B62gdr.png";break;
     case 4:image="https://i.imgur.com/K3e519e.png"; break;
     case 5:image="https://i.imgur.com/7CPX2RB.png";break;
     case 6:image="https://i.imgur.com/VO6XUQq.png";break;
     case 7:image="https://i.imgur.com/r5t0ujK.png";break;
     case 8:image="https://i.imgur.com/EYnD6zx.png";break;
     case 9:image="https://i.imgur.com/2UcLD9j.png";break;
     case 10:image="https://i.imgur.com/LULfQ0m.png";break;
     case 11:image="https://i.imgur.com/kuFNcxo.png";break;
     case 12:image="https://i.imgur.com/IwfArys.png";break;
     case 13:image="https://i.imgur.com/dhYzOoR.png";break;
     case 14:image="https://i.imgur.com/gz1qeFY.png";break;
     case 15:image="https://i.imgur.com/5gV5cyX.png";break;
     case 16:image="https://i.imgur.com/s8c6aGp.png";break;
     case 17:image="https://i.imgur.com/ITVaw96.png";break;
     case 18:image="https://i.imgur.com/jAyI68K.png";break;
     case 19:image="https://i.imgur.com/UyOBkxW.png";break;
     case 20:image="https://i.imgur.com/F3dhbz5.png";break;
     case 21:image="https://i.imgur.com/bZbq1VS.png";break;
     case 22:image="https://i.imgur.com/K1Yekf8.png";break;
     case 23:image="https://i.imgur.com/A4vloIk.png";break;
     case 24:image="https://i.imgur.com/GFqONy7.png";break;
     case 25:image="https://i.imgur.com/P2sYB4I.png";break;
     case 26:image="https://i.imgur.com/HBZYbxo.png";break;
     case 27:image="https://i.imgur.com/atrwEHD.png";break;
     case 28:image="https://i.imgur.com/eykWQER.png";break;
     case 29:image="https://i.imgur.com/MUQiqsC.png";break;
     case 30:image="https://i.imgur.com/0E1CH7X.png";break;
     case 31:image="https://i.imgur.com/OvnV5Ir.png";break;
     case 32:image="https://i.imgur.com/7UwS1HT.png";break;
     case 33:image="https://i.imgur.com/nCA829S.png";break;
     case 34:image="https://i.imgur.com/GtZ3PQl.png";break;
     case 35:image="https://i.imgur.com/y2DMG4y.png";break;
     case 36:image="https://i.imgur.com/9qnGqAZ.png";break;
     case 37:image="https://i.imgur.com/FYKN9Tk.png";break;
     case 38:image="https://i.imgur.com/GpJf9lM.png";break;
     case 39:image="https://i.imgur.com/wYNcmlf.png";break;
     case 40:image="https://i.imgur.com/uhBHw5R.png";break;
     case 41:image="https://i.imgur.com/2hfw0yo.png";break;
     case 42:image="https://i.imgur.com/CzXoQGP.png";break;
     case 43:image="https://i.imgur.com/KmFcN22.png";break;
     case 44:image="https://i.imgur.com/OPhyTq9.png";break;
     case 45:image="https://i.imgur.com/BeZcRAE.png";break;
     case 46:image="https://i.imgur.com/YrxGOl6.png";break;
     case 47:image="https://i.imgur.com/CbABIJ1.png";break;
     case 48:image="https://i.imgur.com/VkY0nHZ.png";break;
     default:image="https://i.imgur.com/OfSLWhy.png";break;
   }
    let myobj = {
     matchNumber: req.body.matchNumber,
     roundNumber: req.body.roundNumber,
     dateUtc: req.body.dateUtc,
     location: req.body.location,
     availability: {
       category1: {
         available: req.body.availability.category1.available,
         pending: req.body.availability.category1.pending,
         price: req.body.availability.category1.price
       },
       category2: {
         available: req.body.availability.category2.available,
         pending:req.body.availability.category2.pending,
         price: req.body.availability.category2.price
       },
       category3: {
        available: req.body.availability.category3.available,
        pending:req.body.availability.category3.pending,
        price: req.body.availability.category3.price
       }            
     },
     homeTeam: req.body.homeTeam,
     awayTeam: req.body.awayTeam,
     image:image,
     group: req.body.group
    };
    db_connect.collection("shopMasterlist").insertOne(myobj, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
  })
 
 });
 
// This section will help you update a record by id.
reserveRoutes.route("/api/reserved/:matchNO/:cno/:capacity").patch( async function (req, response) {
  await dbo.connectToServer(function(err){
  if(err) console.error(err)
  let decrement=Number(req.params.capacity)*-1
 let db_connect = dbo.getDb("worldcup22");
 let myquery = { "matchNumber": Number(req.params.matchNO) };
let newvalues = {
  $inc: {
    "availability.category1.available":decrement,
   "availability.category1.pending":decrement,
  },
};
if (Number(req.params.cno)==1){
  myquery = { "matchNumber": Number(req.params.matchNO),};
newvalues = {
  $inc: {
    "availability.category1.available":decrement,
   "availability.category1.pending":decrement,
  },
};
}
else if(Number(req.params.cno)==2){
  myquery = { "matchNumber": Number(req.params.matchNO), };
newvalues = {
  $inc: {
    "availability.category2.available":decrement,
   "availability.category2.pending":decrement,
  },
};
}
else {
  myquery = { "matchNumber": Number(req.params.matchNO) };
newvalues = {
  $inc: {
    "availability.category3.available":decrement,
   "availability.category3.pending":decrement,
  },
};
}
//console.log(Number(myquery._id.availability.category1.count))
 
 db_connect
   .collection("shopMasterlist")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 document updated for reservation");
     response.json(res);
   })
  })
  ;
});

reserveRoutes.route("/api/pending/:matchNO/:cno/:capacity").patch(async function (req, response) {
  await dbo.connectToServer(async function(err){
    if(err) console.error(err)
    let inc=Number(req.params.capacity)
 let db_connect = dbo.getDb("worldcup22");
 const store= await db_connect.collection("shopMasterlist").findOne({
  matchNumber:Number(req.params.matchNO)
 })
 const cat1=Number(store.availability.category1.available)
 const cat2=Number(store.availability.category2.available)
 const cat3=Number(store.availability.category3.available)
 const pend1=Number(store.availability.category1.pending)
 const pend2=Number(store.availability.category2.pending)
 const pend3=Number(store.availability.category3.pending)
 
 let myquery = { "matchNumber": Number(req.params.matchNO) };
let newvalues = {
  $inc: {
   "availability.category1.pending":0
  },
};
if (Number(req.params.cno)==1 && cat1>= (pend1+inc)){
  myquery = { "matchNumber": Number(req.params.matchNO) };
newvalues = {
  $inc: {
   "availability.category1.pending":inc
  },
};
}
if(Number(req.params.cno)==1 && cat1< (pend1+inc)){
  console.log("TICKET SOLDOUT IN CATEGORY 1")
}
if(Number(req.params.cno)==2 && cat2>=pend2+inc){
  myquery = { "matchNumber": Number(req.params.matchNO) };
newvalues = {
  $inc: {
   "availability.category2.pending":inc
  },
};
}
if(Number(req.params.cno)==2 && cat2< (pend2+inc)){
  console.log("TICKET SOLDOUT IN CATEGORY 2")
}
if(Number(req.params.cno)==3 && cat3>=pend3+inc) {
  myquery = { "matchNumber": Number(req.params.matchNO)};
newvalues = {
  $inc: {
   "availability.category3.pending":inc
  },
};
}
if(Number(req.params.cno)==3 && cat3< (pend3+inc)){
  console.log("TICKET SOLDOUT IN CATEGORY 3")
}
//console.log(Number(myquery._id.availability.category1.count))
 
 db_connect
   .collection("shopMasterlist")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 document updated for reservation");
     response.json(res);
   });
});
  })
  
 //ADD QUANTITY WHEN TICKET CANCELLED
reserveRoutes.route("/api/cancel/:matchNO/:cno/:capacity").patch(async function (req, response) {
  await dbo.connectToServer(function(err){
    if(err)console.error(err)
    let decrement=Number(req.params.capacity)*-1
    let db_connect = dbo.getDb("worldcup22");
    let myquery = { "matchNumber": Number(req.params.matchNO)};
   let newvalues = {
     $inc: {
      "availability.category1.pending":0
     },
   };
   if (Number(req.params.cno)==1){
     myquery = { "matchNumber": Number(req.params.matchNO)};
   newvalues = {
     $inc: {
      "availability.category1.pending":decrement
     },
   };
   }
   else if(Number(req.params.cno)==2){
     myquery = { "matchNumber": Number(req.params.matchNO)};
   newvalues = {
     $inc: {
      "availability.category2.pending":decrement
     },
   };
   }
   else {
     myquery = { "matchNumber": Number(req.params.matchNO)};
   newvalues = {
     $inc: {
      "availability.category3.pending":decrement
     },
   };
   }
    
    db_connect
      .collection("shopMasterlist")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated for reservation");
        response.json(res);
      });
  })
 
});
// This section will help you delete a record
reserveRoutes.route("/api/remove/:id").delete((req, response) => {
 let db_connect = dbo.getDb("worldcup22");
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("Reservations").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
app.listen(port, () => {
  // perform a database connection when server starts
  
  console.log(`Server is running on port: ${port}`);
});
app.use(reserveRoutes)
//module.exports = reserveRoutes;