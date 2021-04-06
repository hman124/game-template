const {http} = require("./server.js");
const io = require("socket.io")(http);

const users = require("./users.js");
const db = require("./database.js");

io.on("connect", socket => {
  socket.on("linkGame", data => {
    console.log(data);
    io.to(data[0]).emit("newUser");
    socket.join(data[0]);
  });
});

console.log("Sockets ready")
