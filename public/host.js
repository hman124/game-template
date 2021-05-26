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

var users = [];

socket.on("newUser", async data => {
  if (users.indexOf(data.user.userId) !== -1 && data.join) {
    return;
  } else if (!data.join) {
    removeUser(data.user.userId);
    document.querySelector("li[data-userId=" + data.user.userId + "]").remove();
  } else {
    users.push(data.user.userId);
    var listElem = document.createElement("li");
    listElem.setAttribute("data-userId", data.user.userId);
    listElem.innerHTML = data.user.screenName;
    document.querySelector("#none").style.display = "none";
    listElem.addEventListener("click", async () => {
      removeUser(event.target.getAttribute("data-userId"));
      event.target.remove();
    });
    document.querySelector("#players").appendChild(listElem);
  }
});

function removeUser(userId) {
  fetch("/game/kick?userId=" + userId, {
    method: "DELETE",
    credentials: "include"
  });
  users.splice(users.indexOf(userId, 1));
  if (users.length == 0) {
    document.querySelector("#none").style.display = "block";
  }
}

window.addEventListener("load", () => {
  document.querySelector("#domain").innerHTML =
    window.location.protocol + "//" + window.location.host;
});
