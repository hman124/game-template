const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const http = require("http").createServer(app);
const socket = require("./sockets.js")(http);

const users = require("./users.js");
const db = require("./database.js");

const hbs = require("hbs");

app.set("view engine", "hbs");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render(`${__dirname}/views/player/play.hbs`);
});

app.get("/play", (req, res) => {
  res.sendFile(`${__dirname}/views/join.html`);
});

app.get("/game/new", (req, res) => {
  let user = new users.User(req.query.user),
      game = new users.Game(user);
  res.cookie("userId", user.userId);
  res.cookie("gamePin", game.gamePin);
  res.redirect(307, "/game/wait");
});

app.get("/game/join", async (req, res) => {
  if (!!req.cookies.userId && !!req.cookies.gamePin) {
    res.send("error, please restart your browser")
  } else {
    const gameExists = await users.gameExists(req.query.gamePin);
    const userExists = await users.userExists(
      req.query.user,
      req.query.gamePin);
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

app.use("/game/*", (req, res, next) => {
  !req.cookies.gamePin? res.redirect(307, "/"): next();
});

app.get("/game/members", async (req, res) => {
  const user = await users.getUser(req.cookies.userId);
  if (user.isHost) {
    res.send(await users.getMembers(req.cookies.gamePin));
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/listdb", async (req, res) => {
  let data = await db.list();
  res.send(data);
});

app.get("/game/wait", async (req, res) => {
    const state = await users.gameState(req.cookies.gamePin);
    const user = await users.getUser(req.cookies.userId);
    if (!state && !!user) {
      res.render(getFilename(user.isHost, "wait"), req.cookies);
    } else {
      res.redirect(307, "/game/play");
    }
  
});

app.get("/game/play", async (req, res) => {
    const state = await users.gameState(req.cookies.gamePin);
    const user = await users.getUser(req.cookies.userId);
    if (state && !!user) {
      res.render(getFilename(user.isHost, "play"), req.cookies);
    } else {
      res.redirect(307, "/game/wait");
    }
});

function getFilename(isHost, filename) {
  if (isHost) {
    return `${__dirname}/views/host/${filename}.hbs`;
  } else {
    return `${__dirname}/views/player/${filename}.hbs`;
  }
}

app.get("/api/cleardb", async (req, res) => {
  db.run("Delete From Games Where 1");
  res.send("OK");
});

http.listen(process.env.PORT);
