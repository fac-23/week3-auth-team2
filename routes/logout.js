const { deleteSession } = require("../database/model");

function post(request, response) {
  // find cookie
  const sid = request.signedCookies.sid;
  console.log("logout", sid);
  deleteSession(sid).then(() => {
    response.clearCookie("sid");
    response.redirect("/");
  });
}

module.exports = { post };
