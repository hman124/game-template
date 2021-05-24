function linkGame(gamePin, userId) {
  window["userId"] = userId;
  var socket = io();
  socket.on("connect", () => {
    socket.emit("linkGame", [gamePin, userId]);
  });

  socket.on("gameStartSuccess", () => {
    window.location.replace("/game/play");
  });
}