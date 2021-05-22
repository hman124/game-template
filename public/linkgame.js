function linkGame(gamePin, userId) {
  var socket = io();
  socket.on("connect", async () => {
    socket.emit("linkGame", [gamePin, userId]);
  });

  socket.on("gameStartSuccess", () => {
    window.location.replace("/game/play");
  });
}

 window.addEventListener("click", addUnload);
var addUnload = () => {
   window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = '';
   });
  window.removeEventListener("click", addUnload);
}