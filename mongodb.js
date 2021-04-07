function query() {
  var { MongoClient } = require("mongodb"),
    url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = { address: /^S/ };
    dbo
      .collection("customers")
      .find(query)
      .toArray((err, result) => {
        if (err) throw err;
        res(result);
        db.close();
      });
  });
}
