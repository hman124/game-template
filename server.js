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
  res.sendFile(`${__dirname}/views/index.html`);
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
  if (req.cookies.userId && req.cookies.gamePin) {
    await db.run("Delete From Users Where userId=?", userId);
    res.cookie("userId", {maxAge:0});
    res.cookie("gamePin", {maxAge:0});
  } 
    const gameExists = await users.gameExists(req.query.gamePin);
    const userExists = await users.userExists(
      req.query.user,req.query.gamePin);
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
});

app.use(async (req, res, next) => {
  //check to make sure that the user is valid. If so, save the details in the request
  if (!req.cookies.gamePin && !req.cookies.userId) {
    res.redirect(307, "/");
  } else {
    let { userId, gamePin } = req.cookies,
        isUserValid = await users.isUserValid(userId, gamePin);
    if (isUserValid) {
      req.game = await db.first("*", "Games", "gamePin=?", gamePin);
      req.user = await db.first("*", "Users", "userId=?", userId);
      next();
    } else {
      res.redirect(307, "/?error=true");
    }
  }
});

app.get("/linkgame.js", (req, res) => {
  res.render(__dirname + "/public/linkgame.js", req.cookies);
});

app.get("/game/members", async (req, res) => {
  if (req.user.isHost) {
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
    if (!req.game.isStarted) {
      res.render(getFilename(req.user.isHost, "wait"), req.cookies);
    } else {
      res.redirect(307, "/game/play");
    }
});

app.get("/game/play", async (req, res) => {
    if (req.game.isStarted) {
      res.render(getFilename(req.user.isHost, "play"), req.cookies);
    } else {
      res.redirect(307, "/game/wait");
    }
});

function getFilename(isHost, filename) {
  return isHost? 
    `${__dirname}/views/host/${filename}.hbs`:
    `${__dirname}/views/player/${filename}.hbs`;
}

app.get("/api/cleardb", async (req, res) => {
  db.run("Delete From Games Where 1");
  res.send("OK");
});

http.listen(process.env.PORT);
