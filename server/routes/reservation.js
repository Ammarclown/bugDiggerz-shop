const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const reserveRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
// This section will help you get a single record by id
reserveRoutes.route("/record/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("records")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you create a new record.
reserveRoutes.route("/reserve").post(function (req, response) {
 let db_connect = dbo.getDb("worldcup22");
 let myobj = {
    ticketNo:req.body.ticketNo,
    price:req.body.price,
    quantity:req.body.quantity,
    description:req.body.description,
    location:req.body.location,
    paymentMethod:req.body.paymentMethod,
    paymentConfirmed:"false",
 };
 db_connect.collection("Reservations").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a record by id.
reserveRoutes.route("/update/:id/:cno/:capacity").patch(function (req, response) {
  let decrement=Number(req.params.capacity)*-1
 let db_connect = dbo.getDb("worldcup22");
 let myquery = { "_id": ObjectId(req.params.id),
"availability.category1.price":75 };
let newvalues = {
  $inc: {
   "availability.category1.count":decrement
  },
};
if (Number(req.params.cno)==1){
  myquery = { "_id": ObjectId(req.params.id),
"availability.category1.price":75 };
newvalues = {
  $inc: {
   "availability.category1.count":decrement
  },
};
}
else if(Number(req.params.cno)==2){
  myquery = { "_id": ObjectId(req.params.id),
"availability.category2.price":125 };
newvalues = {
  $inc: {
   "availability.category2.count":decrement
  },
};
}
else {
  myquery = { "_id": ObjectId(req.params.id),
"availability.category3.price":195 };
newvalues = {
  $inc: {
   "availability.category3.count":-1
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
 //ADD QUANTITY WHEN TICKET CANCELLED
reserveRoutes.route("/cancel/:id/:cno/:capacity").patch(function (req, response) {
  let increment=Number(req.params.capacity)
 let db_connect = dbo.getDb("worldcup22");
 let myquery = { "_id": ObjectId(req.params.id),
"availability.category1.price":75 };
let newvalues = {
  $inc: {
   "availability.category1.count":increment
  },
};
if (Number(req.params.cno)==1){
  myquery = { "_id": ObjectId(req.params.id),
"availability.category1.price":75 };
newvalues = {
  $inc: {
   "availability.category1.count":increment
  },
};
}
else if(Number(req.params.cno)==2){
  myquery = { "_id": ObjectId(req.params.id),
"availability.category2.price":125 };
newvalues = {
  $inc: {
   "availability.category2.count":increment
  },
};
}
else {
  myquery = { "_id": ObjectId(req.params.id),
"availability.category3.price":195 };
newvalues = {
  $inc: {
   "availability.category3.count":-1
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
// This section will help you delete a record
reserveRoutes.route("/remove/:id").delete((req, response) => {
 let db_connect = dbo.getDb("worldcup22");
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("Reservations").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = reserveRoutes;