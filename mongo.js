function dbInsert(coll, data) {
  return new Promise(async (resolve, reject) => {
    var database = await dbOpen();
    database["coll"].insertOne(data, function(err, res) {
      if (err) throw err;
      resolve(res);
      database["db"].close();
    });
  });
}

function dbSelect(coll, data) {
  return new Promise(async (resolve, reject) => {
    var database = await dbOpen();
    database["coll"].find(data).toArray((err, res) => {
      if (err) throw err;
      resolve(res);
      database["db"].close();
    });
  });
}

function dbOpen(coll) {
  return new Promise((resolve, reject) => {
    var { MongoClient } = require("mongodb"),
      url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("gamev1");
      resolve({ db: db, dbo: dbo, coll: dbo.collection(coll) });
    });
  });
}

function dbUpdate(coll, query, set) {
  return new Promise(async (resolve, reject) => {
    var database = await dbOpen(coll);
    database["coll"].updateOne(query, set, (err, res) => {
      if (err) throw err;
      resolve(res);
      database["db"].close();
    });
  });
}

function dbSetup() {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("gamev1");
    dbo.createCollection("users", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}
dbSetup()

module.exports = {
  dbSelect: dbSelect,
  dbInsert: dbInsert,
  dbUpdate: dbUpdate
};
