document.querySelector("#start").addEventListener("click", () => {
  socket.emit("startGame", {
    gamePin: window.gamePin,
    auth: window.userId
  });
});

socket.on("gameStartSuccess", () => {
  window.location.replace("/game/play");
});

socket.on("gameStartFailure", () => {
  alert(
    "Game failed to start... try making a new game ( or not hacking into my code :) )"
  );
});

socket.on("newUser", async (username, userId) => {
  var listElem = document.createElement("li");
  listElem.setAttribute("data-userId", x.userId);
  listElem.innerHTML = x.screenName;

  document.querySelector("#none").style.display = "none";
  listElem.addEventListener("click", async () => {
    fetch("/game/kick?userId=" + event.target.getAttribute("data-userId"), {
      method: "DELETE",
      credentials: "include"
    }).catch(err => {
      alert("This player can't be kicked");
    });
    event.target.remove();
  });
  document.querySelector("#players").appendChild(listElem);
});

window.addEventListener("load", () => {
  document.querySelector("#domain").innerHTML =
    window.location.protocol + "//" + window.location.host;
});
