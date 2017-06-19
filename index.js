var express = require("express");
var cors = require('cors');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var dotenv = require('dotenv');

dotenv.load();

var ObjectID = mongodb.ObjectID;
var MONGO_COLLECTION = "complaints";

var app = express();
var port = process.env.PORT || 8080;
var db;

var corsOptions = {
  origin: [process.env.TEST_ORIGIN, process.env.GH_ORIGIN]
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
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

app.get("/api/complain", function(req, res) {
  db.collection(MONGO_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get complaints.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/complain", function(req, res) {
  var newComplain = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  } else if(!req.body.complain) {
    handleError(res, "Invalid user input", "Must provide a complaint.", 400);
  } else {
    db.collection(MONGO_COLLECTION).insertOne(newComplain, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new contact.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/* TEST POST:
$ curl -H "Content-Type: application/json" -d '{"name":"tgh", "complain": "afffffff...."}' http://localhost:8080/api/complain
*/
