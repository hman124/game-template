var socket = io();
function linkGame(gamePin, userId) {
  window["userId"] = userId;
  socket.on("connect", () => {
    socket.emit("linkGame", [gamePin, userId]);
  });

  socket.on("gameStartSuccess", () => {
    window.location.replace("/game/play");
  });
}

window.onload = 