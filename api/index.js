const express = require("express");
const dbo = require("../db/conn");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const rateLimit = require('express-rate-limit')
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const reserveRoutes = express.Router();

// This will help us connect to the database
// This help convert the id from string to ObjectId for the _id.
//const ObjectId = require("mongodb").ObjectId;
// This section will help you get a single record by id
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 3, 
	standardHeaders: true, 
	legacyHeaders: false, 
}) 
reserveRoutes.use(limiter)

reserveRoutes.route("/api/record/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("records")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
reserveRoutes.route("/api/records").get(function (req, res) {
  let db_connect = dbo.getDb("worldcup22");
  db_connect
    .collection("shopMasterlist")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log("get request in record")
      res.json(result);
    });
 });
// This section will help you create a new record.
reserveRoutes.route("/api/matches").post(function (req, response) {
  let db_connect = dbo.getDb("worldcup22");
  mno=Number(req.body.matchNumber)
  image=""
  switch(mno){
   case 1:image="https://i.ibb.co/G9nQ0G0/qatarvsequador.png"; break;
   case 2:image="https://i.ibb.co/pjxhsrS/netherlandvssenegal.png"; break;
   case 3:image="https://i.ibb.co/4MhBC8P/englandvsiran.png";break;
   case 4:image="https://i.ibb.co/yFW8TZM/usavswales.png"; break;
   case 5:image="https://i.ibb.co/hC103yb/francevsaustralia.png";break;
   case 6:image="https://i.ibb.co/YtRw0Ss/tunisiavsdenmark.png";break;
   case 7:image="https://i.ibb.co/bQsZs4S/mexicovspoland.png";break;
   case 8:image="https://i.ibb.co/y58xGSs/argentinavsksa.png";break;
   case 9:image="https://i.ibb.co/B3x4qZ4/belgiumvscanada.png";break;
   case 10:image="https://i.ibb.co/tDJtqQz/spainvscostarica.png";break;
   case 11:image="https://i.ibb.co/jhDBQMd/germanyvsjapan.png";break;
   case 12:image="https://i.ibb.co/xqSt4v7/morrocovscroatia.png";break;
   case 13:image="https://i.ibb.co/Cbf00HZ/switzerlandvscameron.png";break;
   case 14:image="https://i.ibb.co/Qj0CBxX/uruguayvskorea.png";break;
   case 15:image="https://i.ibb.co/fH1vY1J/portugalvsgana.png";break;
   case 16:image="https://i.ibb.co/hZpKWtH/brazilvsserbia.png";break;
   case 17:image="https://i.ibb.co/cc768wj/walesvsiran.png";break;
   case 18:image="https://i.ibb.co/NsrPvrL/qatarvssenegal.png";break;
   case 19:image="https://i.ibb.co/QYNmHTQ/equadorvsnetherland.png";break;
   case 20:image="https://i.ibb.co/0p7CYgS/usavsengland.png";break;
   case 21:image="https://i.ibb.co/MBMMth6/tunisiavsaustralia.png";break;
   case 22:image="https://i.ibb.co/ZGYr1fG/polandvsksa.png";break;
   case 23:image="https://i.ibb.co/vsX0gbM/francevsdenmark.png";break;
   case 24:image="https://i.ibb.co/MgfbZ4m/argentinavsmexico.png";break;
   case 25:image="https://i.ibb.co/YPBbf0T/japanvscostarica.png";break;
   case 26:image="https://i.ibb.co/3zkQYW0/belgiumvsmorroco.png";break;
   case 27:image="https://i.ibb.co/pzR8q65/croatiavscanada.png";break;
   case 28:image="https://i.ibb.co/KGHvxhR/spainvsgermany.png";break;
   case 29:image="https://i.ibb.co/TWPSNPn/cameroonvsserbia.png";break;
   case 30:image="https://i.ibb.co/JjT1wdY/koreavsghana.png";break;
   case 31:image="https://i.ibb.co/yf8fQ9B/brazilvsswitzerland.png";break;
   case 32:image="https://i.ibb.co/MDnZ5NB/portugalvsurugay.png";break;
   case 33:image="https://i.ibb.co/Wy84Jqd/walesvsengland.png";break;
   case 34:image="https://i.ibb.co/Y2cZW6d/usavsiran.png";break;
   case 35:image="https://i.ibb.co/mtV2GH7/senegalvsecuador.png";break;
   case 36:image="https://i.ibb.co/9hqPQ2Z/netherlandvsqatar.png";break;
   case 37:image="https://i.ibb.co/gvX79Ck/denmarkvsaustralia.png";break;
   case 38:image="https://i.ibb.co/JQZhpL6/tunisiavsfrance.png";break;
   case 39:image="https://i.ibb.co/LhGLwZZ/argentinavspoland.png";break;
   case 40:image="https://i.ibb.co/RcxNHqM/ksavsmexico.png";break;
   case 41:image="https://i.ibb.co/rxF9pZz/croatiavsbelgium.png";break;
   case 42:image="https://i.ibb.co/kGrmYV5/canadavsmorroco.png";break;
   case 43:image="https://i.ibb.co/vkMf2cL/spainvsjapan.png";break;
   case 44:image="https://i.ibb.co/NtRDN1M/costaricavsgermany.png";break;
   case 45:image="https://i.ibb.co/W351hD5/ghanavsurugay.png";break;
   case 46:image="https://i.ibb.co/sPznx3P/portugalvskorea.png";break;
   case 47:image="https://i.ibb.co/WKhPLCd/serbiavsswitzerland.png";break;
   case 48:image="https://i.ibb.co/3fbjt5T/cameroonvsbrazil.png";break;
   default:image="https://i.ibb.co/WzMJwvv/knockouts.png";break;
 }
  let myobj = {
   matchNumber: req.body.matchNumber,
   roundNumber: req.body.roundNumber,
   dateUtc: req.body.dateUtc,
   location: req.body.location,
   availability: {
     category1: {
       available: req.body.available,
       pending: req.body.pending,
       price: req.body.price
     },
     category2: {
       available: req.body.available,
       pending: req.body.pending,
       price: req.body.price
     },
     category3: {
       available: req.body.available,
       pending: req.body.pending,
       price: req.body.price
     }            
   },
   homeTeam: req.body.homeTeam,
   awayTeam: req.body.awayTeam,
   image:image,
   group: req.body.group
  };
  db_connect.collection("updatedMasterlist").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
 });
 
// This section will help you update a record by id.
reserveRoutes.route("/api/reserved/:matchNO/:cno/:capacity").patch(function (req, response) {
  let decrement=Number(req.params.capacity)*-1
 let db_connect = dbo.getDb("worldcup22");
 let myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category1.price":75 };
let newvalues = {
  $inc: {
    "availability.category1.available":decrement,
   "availability.category1.pending":decrement,
  },
};
if (Number(req.params.cno)==1){
  myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category1.price":75 };
newvalues = {
  $inc: {
    "availability.category1.available":decrement,
   "availability.category1.pending":decrement,
  },
};
}
else if(Number(req.params.cno)==2){
  myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category2.price":125 };
newvalues = {
  $inc: {
    "availability.category2.available":decrement,
   "availability.category2.pending":decrement,
  },
};
}
else {
  myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category3.price":195 };
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
   });
});

reserveRoutes.route("/api/pending/:matchNO/:cno/:capacity").patch(async function (req, response) {
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
 
 let myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category1.price":75 };
let newvalues = {
  $inc: {
   "availability.category1.pending":0
  },
};
if (Number(req.params.cno)==1 && cat1>= (pend1+inc)){
  myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category1.price":75 };
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
  myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category2.price":125 };
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
  myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category3.price":195 };
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
 //ADD QUANTITY WHEN TICKET CANCELLED
reserveRoutes.route("/api/cancel/:matchNO/:cno/:capacity").patch(function (req, response) {
  let decrement=Number(req.params.capacity)*-1
 let db_connect = dbo.getDb("worldcup22");
 let myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category1.price":75 };
let newvalues = {
  $inc: {
   "availability.category1.pending":0
  },
};
if (Number(req.params.cno)==1){
  myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category1.price":75 };
newvalues = {
  $inc: {
   "availability.category1.pending":decrement
  },
};
}
else if(Number(req.params.cno)==2){
  myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category2.price":125 };
newvalues = {
  $inc: {
   "availability.category2.pending":decrement
  },
};
}
else {
  myquery = { "matchNumber": Number(req.params.matchNO),
"availability.category3.price":195 };
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
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});
app.use(reserveRoutes)
//module.exports = reserveRoutes;