const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const http = require("http").createServer(app);
const socket = require("./sockets.js")(http);

const users = require("./users.js");
const db = require("./database.js");

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
  const gameExists = await users.gameExists(req.query.gamePin);
  const userExists = await users.userExists(req.query.gamePin, req.query.user);
  if (gameExists && !userExists) {
    let user = new users.User(req.query.user, req.query.gamePin);
    res.cookie("gamePin", user.currentGame);
    res.cookie("userId", user.userId);
    res.redirect(307, "/game/wait");
  } else if(userExists) {
    res.redirect("/play?taken=true");    
  } else {
    res.send("Game Doesn't Exist");
  }
});

app.get("/game/members", async (req, res) => {
  res.send(await users.getMembers(req.cookies.gamePin));
});

app.get("/api/listdb", async (req, res) => {
  let data = await db.list();
  res.send(data);
});

app.get("/game/info", async (req, res) => {
  res.send(req.cookies);
});

app.get("/game/wait", async (req, res) => {
  const state = await users.gameState(req.cookies.gamePin);
  const user = await users.getUser(req.cookies.userId);
  if (!state && !!user) {
    res.sendFile(getFilename(user.isHost, "wait"));
  } else {
    res.redirect(307, "/game/play");
  }
});

app.get("/game/play", async (req, res) => {
  const state = await users.gameState(req.cookies.gamePin);
  const user = await users.getUser(req.cookies.userId);
  if (state && !!user) {
    res.sendFile(getFilename(user.isHost, "play"))   
  } else {
    res.redirect(307, "/game/wait");
  }
});

function getFilename(isHost, filename) {
   switch (isHost) {
      case true:
       return `${__dirname}/views/host/${filename}.html`;
      break;
      case false:
       return `${__dirname}/views/player/${filename}.html`;
      break;
  }
}

app.get("/api/cleardb", async (req, res) => {
  db.run("Delete From Games Where 1");
  res.send("OK");
});

http.listen(process.env.PORT);
