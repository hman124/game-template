var url =
      process.env.protocol +
      process.env.user +
      ":" +
      process.env.password +
      "@" +
      process.env.host +
      "/" +
      process.env.path +
      process.env.query,
    dbo;

function dbInsert(coll, data) {
    dbo.insertOne(data, function(err, res) {
      if (err) throw err;});
}

function dbSelect(coll, data) {
  return new Promise(async (resolve, reject) => {
    database["coll"].find(data).toArray((err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });
}

function dbOpen(coll) {
  return new Promise((resolve, reject) => {
    var { MongoClient } = require("mongodb");
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dboa = db.db("gamev1");
      dbo = dboa;
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
dbSetup();

module.exports = {
  dbSelect: dbSelect,
  dbInsert: dbInsert,
  dbUpdate: dbUpdate
};
