function dbInsert(coll, data) {
  return new Promise(async (res, rej) => {
    var database = await dbOpen();
    database["dbo"].collection(coll).insertOne(data, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      database["db"].close();
    });
  });
}

async function dbSelect(coll, data) {
  var database = await dbOpen();
  database["dbo"]
    .collection(coll)
    .find(data)
    .toArray((err, res) => {
      if (err) throw err;
      console.log("1 document inserted");
      database["db"].close();
    });
}

function dbOpen() {
  return new Promise((res, rej) => {
    var { MongoClient } = require("mongodb"),
      url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("gamev1");
      res({ db: db, dbo: dbo });
    });
  });
}

async function dbUpdate(coll, query, set) {
  var database = await dbOpen(coll);
  database["dbo"].collection(coll).updateOne(query, set, (err, res) => {
    if (err) throw err;
    console.log("1 document updated");
    database["db"].close();
  });
}

/*(function() {
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
})();
*/

module.exports = {
  dbSelect: dbSelect,
  dbInsert: dbInsert
};
