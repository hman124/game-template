(function() {
  var socket = io(),
    gameInfo;

  socket.on("connect", async () => {
    var req = await fetch("/game/info"),
      data = await req.json();
    gameInfo = data;
    socket.emit("linkGame", [data.gamePin, data.userId]);
    document.querySelector("#gamepin").innerHTML = data.gamePin;
  });

  document.querySelector("#start").addEventListener("click", () => {
    socket.emit("startGame", {
      gamePin: gameInfo.gamePin,
      auth: gameInfo.userId
    });
  });

  socket.on("newUser", () => {
    updatePlayers();
  });

  socket.on("gameStartSuccess", () => {
    window.location.replace("/game/play");
  });

  socket.on("gameStartFailure", () => {
    alert(
      "Game failed to start... try making a new game ( or not hacking into my code :) )"
    );
  });

  document.querySelector("#domain").innerHTML =
    window.location.protocol + "//" + window.location.host;
})();
