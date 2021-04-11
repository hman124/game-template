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

app.get("/play", (req, res) => {
  res.sendFile(`${__dirname}/views/join.html`);
});

app.get("/game/new", (req, res) => {
  let user = new users.User(req.query.user);
  let game = new users.Game(user);
  res.cookie("userId", user.userId);
  res.cookie("gamePin", game.gamePin);
  res.redirect(307, "/game/wait");
});

app.get("/game/join", async (req, res) => {
  if (!!req.cookies.userId && !!req.cookies.gamePin) {
    res.send(
      "You are already in a game as a player or host." +
        "To join another game, please restart your browser. " +
        "In the future, there will be a log out button."
    );
  } else {
    const gameExists = await users.gameExists(req.query.gamePin);
    const userExists = await users.userExists(
      req.query.user,
      req.query.gamePin
    );
    if (gameExists && !userExists) {
      let user = new users.User(req.query.user, req.query.gamePin);
      res.cookie("gamePin", user.currentGame);
      res.cookie("userId", user.userId);
      res.redirect(307, "/game/wait");
    } else if (userExists) {
      res.redirect("/play?taken=true");
    } else {
      res.send("Game Doesn't Exist");
    }
  }
});

app.get("/game/members", async (req, res) => {
  const user = await users.getUser(req.cookies.userId);
  if (user.isHost) {
    res.send(await users.getMembersHost(req.cookies.gamePin));
  } else {
    res.send(await users.getMembers(req.cookies.gamePin));
  }
});

app.get("/api/listdb", async (req, res) => {
  let data = await db.list();
  res.send(data);
});

app.get("/game/info", async (req, res) => {
  res.send(req.cookies);
});

app.get("/game/wait", async (req, res) => {
  if (!req.cookies.gamePin) {
    res.redirect(307, "/");
  } else {
    const state = await users.gameState(req.cookies.gamePin);
    const user = await users.getUser(req.cookies.userId);
    if (!state && !!user) {
      res.sendFile(getFilename(user.isHost, "wait"));
    } else {
      res.redirect(307, "/game/play");
    }
  }
});

app.get("/game/play", async (req, res) => {
  if (!req.cookies.gamePin) {
    res.redirect(307, "/");
  } else {
    const state = await users.gameState(req.cookies.gamePin);
    const user = await users.getUser(req.cookies.userId);
    if (state && !!user) {
      res.sendFile(getFilename(user.isHost, "play"));
    } else {
      res.redirect(307, "/game/wait");
    }
  }
});

function getFilename(isHost, filename) {
  if (isHost) {
    return `${__dirname}/views/host/${filename}.html`;
  } else {
    return `${__dirname}/views/player/${filename}.html`;
  }
}

app.get("/api/cleardb", async (req, res) => {
  db.run("Delete From Games Where 1");
  res.send("OK");
});

http.listen(process.env.PORT);
