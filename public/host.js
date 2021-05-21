function setup(gamePin, userId) {
  var socket = io();
  document.querySelector("#start").addEventListener("click", () => {
    socket.emit("startGame", {
      gamePin: gamePin,
      auth: userId
    });
  });

  socket.on("newUser", () => {
    updatePlayers();
  });

  socket.on("gameStartSuccess", () => {
    window.location.replace("/game/play");
  });

  socket.on("gameStartFailure", () => {
    alert("Game failed to start... try making a new game ( or not hacking into my code :) )");
  });

  async function updatePlayers() {
    document.querySelector("#players").innerHTML = "";
    var req = await fetch("/game/members"),
      data = await req.json();
    data.forEach(x => {
      var listElem = document.createElement("li"),
        title = x.isHost ? " (host)" : "";
      listElem.innerHTML = x.screenName + title;
      document.querySelector("#players").appendChild(listElem);
    });
  }

  window.addEventListener("load", updatePlayers);

  document.querySelector("#domain").innerHTML =
    window.location.protocol + "//" + window.location.host;
}
