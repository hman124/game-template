const dbFile = "./.data/gamev1.2.db";
const fs = require("fs");
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!exists) {
    db.run("CREATE TABLE Games (gamePin TEXT, numUsers INT, hostId TEXT, isStarted BOOL)");
    db.run("CREATE TABLE Users (userId TEXT, screenName TEXT, currentGame TEXT, isHost BOOL)");
  } else {
    //console.log("Database ready");
  }
});
//db.run("Update Games Set isStarted=0 Where gamePin=?", "3ebc");
//db.run("Delete From Games Where 1=0")
//db.run("Delete From Users Where 1")

function dbAll(selection, table, where, ...stmts) {
  return new Promise((res, rej) => {
    db.all(`Select ${selection} From ${table} Where ${where}`, ...stmts, (err, rows) => {
      if (err) {
        rej(err);
      } else {
        res(rows);
      }
    });
  });
}

function dbRun(query, ...stmts) {
  return new Promise((res, rej) => {
    db.run(query, ...stmts, err => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}

function dbFirst(selection, table, where, ...stmts) {
  return new Promise((res, rej) => {
    db.all(`Select ${selection} From ${table} Where ${where}`, ...stmts, (err, rows) => {
      if (err) {
        rej(err);
      } else if (rows) {
        if (rows.length) {
          res(rows[0]);
        } else {
          res({});
        }
      }
    });
  });
}

async function dbList() {
  return await dbAll("Select * From Users", []);
}

module.exports = {
  run: dbRun,
  all: dbAll,
  first: dbFirst,
  list: dbList
};
