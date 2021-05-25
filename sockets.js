module.exports = function(http) {
  const io = require("socket.io")(http);

  const users = require("./users.js");
  const db = require("./database.js");

  io.on("connect", socket => {
    socket.on("linkGame", async data => {
      let {gamePin, userId} = data,
          isValid = users.isUserValid(userId, gamePin),
          user = await db.first("*", "Users", "userId=?", userId)
      if(isValid) {
        Object.values(data).forEach(x => {socket.join(x);});
        if(!user.isHost) {io.to(gamePin).emit("newUser", user);}
      } else {
        socket.emit("linkGameFailure", {"message":"user doesn't exist in game"})
      }
    });

    socket.on("win", async userId => {
      var user = await db.first("*", "Users", "userId=?", userId),
          {hostId} = await db.first("hostId", "Games", "gamePin=?", user.currentGame);
      io.to(hostId).emit("win", user);
      await db.run("Delete From Users Where userId=?", userId);
    });

    socket.on("startGame", async data => {
      const game = await db.first("*", "Games", "gamePin=?", data.gamePin);
      if (game && game.hostId == data.auth) {
        await db.run("Update Games Set isStarted=1 Where gamePin=?", data["gamePin"]);
        io.to(data["gamePin"]).emit("gameStartSuccess");
      } else {
        io.to(data["auth"]).emit("gameStartFailure");
      }
    });
  });
  return io;
};
