const db = require("./database.js");
const crypto = require("crypto");

class User {
  constructor(screenName, currentGame) {
    this.userId = crypto.randomBytes(8).toString("hex");
    this.screenName = screenName;
    this.currentGame = currentGame;
    this.insertDb();
  }
  insertDb() {
    db.run(
      "Insert Into Users (userId, screenName, currentGame, isHost) Values (?,?,?,?)",
      [this.userId, this.screenName, this.currentGame, !this.currentGame]
    );
    db.run("Update Games Set numUsers=numUsers+1 Where gamePin=?", [
      this.currentGame
    ]);
  }
}

class Game {
  constructor(user) {
    this.hostId = user.userId;
    this.gamePin = crypto.randomBytes(2).toString("hex");
    this.insertDb();
  }
  insertDb() {
    db.run(
      "Insert Into Games (hostId, gamePin, numUsers, isStarted) Values (?,?,0,false)",
      [this.hostId, this.gamePin]
    );
    db.run("Update Users Set currentGame=? Where userId=?", [
      this.gamePin,
      this.hostId
    ]);
  }
}

const getGame = async pin =>
  await db.first("Select * From Games Where gamePin=?", [pin]);
const gameExists = async pin => !!(await getGame(pin)).hostId;
const gameState = async pin => !!(await getGame(pin)).isStarted;

(async function() {
  console.log(await gameExists("2b5e"));
})();

const getUser = async id => await db.first("Select * From Users Where userId=?", [id]);


const getMembers = async pin => 
  var users = 

module.exports = {
  User: User,
  Game: Game,
  gameExists: gameExists,
  gameState: gameState,
  getUser: getUser,
  getMembers: getMembers
};
