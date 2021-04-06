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
  });
};
