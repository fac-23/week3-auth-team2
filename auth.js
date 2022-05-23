const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const model = require("./database/model");
const { match } = require("assert");

const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 600000,
  sameSite: "strict",
  signed: true,
};

function createUser(name, email, password) {
  return bcrypt.hash(password, 10).then((hash) => {
    return model.createUserDB(name, email, hash);
  });
}

function saveUserSession(user) {
  // console.log("saveUserSEssion", user);
  const sid = crypto.randomBytes(18).toString("base64");
  return model.createSession(sid, { user });
}

function verifyUser(email, password) {
  //bcrypt compare current password to DB password
  return model.getUser(email).then((user) => {
    console.log("user", user);
    return bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        throw new Error("Password mismatch");
      } else {
        delete user.password;
        return user;
      }
    });
  });
}

module.exports = { COOKIE_OPTIONS, createUser, saveUserSession, verifyUser };
