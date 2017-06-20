var express = require("express");
var cors = require('cors');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var dotenv = require('dotenv');

dotenv.load();

var ObjectID = mongodb.ObjectID;
var MONGO_COLLECTION = "complaints";
var QUERY_LIMIT = 20;

var app = express();
var port = process.env.PORT || 8080;
var db;

app.use(cors({
  origin: [process.env.TEST_ORIGIN, process.env.GH_ORIGIN]
}));
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

app.post("/api/complain/last", function(req, res) {
  var findObject = {};

  if(req.body.last) {
    findObject._id = { $lt: mongodb.ObjectID(req.body.last) };
  }

  db.collection(MONGO_COLLECTION).find(findObject).sort({_id: -1}).limit(QUERY_LIMIT).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get complaints.");
    } else {
      res.status(201).json(docs);
    }
  });
});

app.post("/api/complain/since", function(req, res) {
  if(!req.body.since) {
    handleError(res, "Invalid user input", "Must provide an id.", 400);
  } else {
    var sinceId = mongodb.ObjectID(req.body.since);

    db.collection(MONGO_COLLECTION).find({ _id: {$gt: sinceId} }).limit(QUERY_LIMIT).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get complaints.");
      } else {
        res.status(201).json(docs);
      }
    });
  }
});

app.post("/api/complain", function(req, res) {
  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  } else if(!req.body.complaint) {
    handleError(res, "Invalid user input", "Must provide a complaint.", 400);
  } else {
    var newComplaint = req.body;

    db.collection(MONGO_COLLECTION).insertOne(newComplaint, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new contact.");
      } else {
        res.status(201).json([doc.ops[0]]);
      }
    });
  }
});

/* TEST POST:
curl -H "Content-Type: application/json" -d '{"name":"tgh", "complaint": "afffffff...."}' http://localhost:8080/api/complain
*/
