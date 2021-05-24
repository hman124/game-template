module.exports = function(http) {
  const io = require("socket.io")(http);

  const users = require("./users.js");
  const db = require("./database.js");

  io.on("connect", socket => {
    socket.on("linkGame", data => {
      io.to(data[0]).emit("newUser");
      socket.join(data[0]);
      socket.join(data[1]);
    });
    socket.on("win", async userId => {
      var user = await users.getUser(userId),
          game = await users.getGame(user[0].gamePin);
      console.log(user,game);
      if(user.userId && game.gamePin) {
        io.to(game.hostId).emit("hostwin", user);
      }
    });
    socket.on("startGame", async data => {
      console.log("starting game if creds are right");
      const game = await users.getGame(data['gamePin']);
      if(game && game.hostId == data['auth']) {
        await db.run("Update Games Set isStarted=1 Where gamePin=?", [data['gamePin']]);
        io.to(data['gamePin']).emit("gameStartSuccess");
      } else {
        io.to(data['auth']).emit("gameStartFailure");
      }
    });
  });
};
