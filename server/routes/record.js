const express = require("express");

//recordRoutes is instance of express router
// defin routes, middleware wil take control of req startin wit path /record.

const recordRoutes = express.Router();

//help connect to database
const dbo = require("../db/conn");

//convert id from string to objectID for _id
const ObjectId = require("mongodb").ObjectId;

//list of all records
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    db_connect
        .collection("records")
        .find({})
        .toArray(function (err, result) {
            if(err) throw err;
            res.json(result);
        });
});

// single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = {_id: ObjectId( req.params.id )};
    db_connect
        .collection("records")
        .findOne(myquery, function (err, result) {
            if(err) throw err;
            res.json(result);
        });
});

//create new record
recordRoutes.route("/record/add").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
    };
    db_connect.collection("records").insertOne(myobj, function (err, res){
        if(err)throw err;
        response.json(res);
    });
});

//update a record by id
recordRoutes.route("/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    let newvalues = {
        $set: {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        },
    };
    db_connect
        .collection("records")
        .updateOne(myquery, newvalues, function(err, res){
            if(err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

//delete record
recordRoutes.route("/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect.collection("records").deleteOne(myquery, function(err, obj){
        if(err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});

module.exports = recordRoutes;