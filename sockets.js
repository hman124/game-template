const server = require("./server.js");
const io = require("socket.io")(server.http);

io.on("connect", socket => {
  socket.on("linkGame", data => {
    console.log(data);
    io.to(data[0]).emit("newUser");
    socket.join(data[0]);
  });
});
