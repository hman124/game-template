const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const users = require("./users.js");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.get("/game/new", (req, res) => {
  let user = new users.User(req.query.user);
  let game = new users.Game(user);
  user.currentGame = game.gamePin;
  res.cookie("userId", user.userId);
  res.cookie("gamePin", game.gamePin);
  res.redirect(307, "/game/wait");
});

app.get("/game/join", async (req, res) => {
  const exists = await users.gameExists(req.query.gamePin);
  if (exists) {
    let user = new users.User(req.query.user, req.query.gamePin);
    user.insertDb();
    res.cookie("gamePin", user.currentGame);
    res.cookie("userId", user.userId);
    res.redirect(307, "/game/wait");
  } else {
    res.send("Game Doesn't Exist");
  }
});

app.get("/game/members", async (req, res) => {
  var members = await users.getMembers(req.cookies.gamePin);
  res.send(members);
});

app.get("/api/listdb", async (req, res) => {
  let data = await db.list();
  res.send(data);
});

app.get("/game/info", async (req, res) => {
  res.send(req.cookies);
});

app.get("/game/wait", async (req, res) => {
  let playing = await users.gameState(req.cookies.gamePin);
  if (!playing) {
    var userState = await users.getUser(req.cookies.userId);
    if (userState.isHost) {
      res.sendFile(__dirname + "/views/host/wait.html");
    } else {
      res.sendFile(__dirname + "/views/player/wait.html");
    }
  } else {
    res.redirect(307, "/game/play");
  }
});

app.get("/game/play", async (req, res) => {
  let playing = await users.gameState(req.cookies.gamePin);
  if (playing) {
    res.send(data);
  } else {
    res.redirect(307, "/game/wait");
  }
});

app.get("/api/cleardb", async (req, res) => {
  db.run("Delete From Games Where 1");
  res.send("hi");
});

var listener = http.listen(process.env.PORT, () => {
  console.log("Server ready")
});
