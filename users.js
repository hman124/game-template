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

async function getGame(gamePin) {
  var game = await db.first("Select * From Games Where gamePin=?", [gamePin]);
  return 
}

console.log(getGame("deaf"))

async function gameExists(gamePin) {
  var game = Game.get(gamePin);

  return !!data.gamePin;
}

async function gameState(gamePin) {
  let data = await db.first("Select isStarted From Games Where gamePin=?", [
    gamePin
  ]);
  return !!parseInt(data.isStarted);
}

async function getUser(userId) {
  var userData = await db.first("Select * From Users Where userId=?", [userId]);
  return userData;
}

async function getMembers(gamePin) {
  var users = await db.all("Select * From Users Where gamePin=?", gamePin);
  return users;
}

module.exports = {
  User: User,
  Game: Game,
  gameExists: gameExists,
  gameState: gameState,
  getUser: getUser,
  getMembers: getMembers
};
