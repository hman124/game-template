function dbQuery(query) {
  return new Promise((res, rej) => {
    var { MongoClient } = require("mongodb"),
      url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo
        .collection("games")
        .find(query)
        .toArray((err, result) => {
          if (err) throw err;
          res(result);
          db.close();
        });
    });
  });
}

function dbInsert(query) {
  return new Promise((res, rej) => {
    var { MongoClient } = require("mongodb"),
      url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo
        .collection("games")
        .insert(query)
        .toArray((err, result) => {
          if (err) throw err;
          res(result);
          db.close();
        });
    });
  });
}
