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
