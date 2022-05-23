const express = require("express");
//initialise db object

const server = express();
const cookieParser = require("cookie-parser");

const staticHandler = express.static("public");
server.use(staticHandler);

const bodyParser = express.urlencoded({ extended: false });
server.use(bodyParser);

const home = require("./routes/home.js");
const signup = require("./routes/signup.js");
const login = require("./routes/login.js");
const newsfeed = require("./routes/newsfeed.js");
const logout = require("./routes/logout.js");
const deleteitem = require("./routes/deleteitem.js");
const errorpage = require("./routes/404.js");

// COOKIE_SECRET lives in .env to stop it ending up on GitHub
// it is used to sign cookies so we can trust them
server.use(cookieParser(process.env.COOKIE_SECRET));

// get
server.get("/", home.get);
server.get("/signup", signup.get);
server.get("/login", login.get);
server.get("/newsfeed", newsfeed.get);

// post
server.post("/newsfeed", newsfeed.post);
server.post("/signup", signup.post);
server.post("/login", login.post);
server.post("/logout", logout.post);
server.post("/deleteitem", bodyParser, deleteitem.post);

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
