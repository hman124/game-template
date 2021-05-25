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

var num_users = 0;

socket.on("newUser", async user => {
  num_users++;
  var listElem = document.createElement("li");
  listElem.setAttribute("data-userId", user.userId);
  listElem.innerHTML = user.screenName;

  document.querySelector("#none").style.display = "none";
  listElem.addEventListener("click", async () => {
    fetch("/game/kick?userId=" + event.target.getAttribute("data-userId"), {
      method: "DELETE",
      credentials: "include"
    });
    num_users--;
    if(num_users == 0) {
      document.querySelector("#none").style.display = "block";       
    }
    event.target.remove();
  });
  document.querySelector("#players").appendChild(listElem);
});

window.addEventListener("load", () => {
  document.querySelector("#domain").innerHTML =
    window.location.protocol + "//" + window.location.host;
});
