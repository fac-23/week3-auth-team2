const model = require("../database/model");

function post(request, response) {
  // console.log("request", request);
  console.log("request", request.body.itemId);
  let id = request.body.itemId; // value of 7 which is the id of that product id
  // deleteItem(id);
  model.deleteItem(id).then((result) => {
    response.redirect("/newsfeed");
  });
}

module.exports = { post };
