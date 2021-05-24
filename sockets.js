module.exports = function(http) {
  const io = require("socket.io")(http);

  const users = require("./users.js");
  const db = require("./database.js");

  io.on("connect", socket => {
    socket.on("linkGame", data => {
      data.forEach(x => {
        socket.join(x);
      });
      io.to(data[0]).emit("newUser");
    });
    
    socket.on("win", async userId => {
      var user = await db.first("Select * From Users Where userId=?", userId),
          game = await db.first("Select * From Games Where gamePin=?", user.currentGame);
        io.to(game.hostId).emit("win", user);
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
  return io;
};
