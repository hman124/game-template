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

socket.on("newUser", async user => {
  if (users.indexOf(user.userId) !== -1) {
    return;
  } else {
    users.push(user.userId);
    var listElem = document.createElement("li");
    listElem.setAttribute("data-userId", user.userId);
    listElem.innerHTML = user.screenName;
    document.querySelector("#none").style.display = "none";
    listElem.addEventListener("click", async () => {
      removeUser(event.target.getAttribute("data-userId"));
      event.target.remove();
    });
    document.querySelector("#players").appendChild(listElem);
  }
});

socket.on("userLeave", user => {
  document.querySelector("li[data-userId='" + user.userId + "']").remove();
  removeUser(user.userId);
  new Noty({
    timeout:1500,
    text: "\"" + user.screenName + "\" left"
  }).show();
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
