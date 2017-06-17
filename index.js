var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var dotenv = require('dotenv');

dotenv.load();

var ObjectID = mongodb.ObjectID;
var CONTACTS_COLLECTION = "complaints";

var app = express();
var port = process.env.PORT || 8080;
var db;

app.use(bodyParser.json());
app.use('/', express.static('.'));


mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(port, function () {
    var rport = server.address().port;
    console.log("App now running on port", rport);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/c", function(req, res) {
  res.status(200).json("hahahaha");
});

app.post("/c", function(req, res) {
  var newComplain = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  } else if(!req.body.complain) {
    handleError(res, "Invalid user input", "Must provide a complaint.", 400);
  }
  res.status(201).json("success");
});
