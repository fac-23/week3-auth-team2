// for the get request: check if user is logged in and redirect to newsfeed
// if not signed up or logged in - redirect to homepage

// const { listenerCount } = require("process");
const db = require("../database/connection.js");
const model = require("../database/model.js");

function get(request, response) {
  db.query("SELECT * FROM products").then((result) => {
    const items = result.rows;

    // get cookie
    const sid = request.signedCookies.sid;
    if (sid) {
      // get session return data object
      model.getSession(sid).then((data) => {
        // console.log("data", data);
        // get data object, then user object and access id key.
        const userId = data.user.id;
        // console.log("items added",items);
        const itemsList = items
          .map((item) => {
            // console.log(["userId", userId, "compare", item.seller_id]);
            // console.log("whats item", item);
            if (userId === item.seller_id) {
              return `<li class="item">
              <div>
                <h2 class="item-title">${item.title}</h2>
                <p>Type: ${item.product_type}</p>
                <p>Description: ${item.description}</p>
                <p>£${item.price}</p>
                <form action="/deleteitem" method="POST">
                <input type="hidden" id="deleteInput" name="itemId" value="${item.id}"/>
                  <button id="deleteItem">Delete item<span class="far fa-trash-alt"></span></button>
                </form>
              </div>
            </li>`;
            } else {
              return `<li class="item">
              <div>
                <h2 class="item-title">${item.title}</h2>
                <p>Type: ${item.product_type}</p>
                <p>Description: ${item.description}</p>
                <p>£${item.price}</p>
              </div>
            </li>`;
            }
          })
          .reverse()
          .join("");

        response.send(
          `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="stylesheet" type="text/css" href="./style.css" />
              <script src="https://kit.fontawesome.com/288a4a188a.js"
      crossorigin="anonymous"></script>
              <title>DevPop</title>
          </head>
          <body>
          <section>
          <form action="/logout" method="POST">
          <button class="btn logout">Log out</button>
        </form>
          </section>
              <section>
                  
                  <section id="news-feed-container" class="flex">
                  <div class="logo"></div>
                  <h1>DevPop Feed</h1>
                  <p>Add your item</p>
                  <form action="/newsfeed" method="POST" id="add-item" class="flex">
                  <label for="name">Username<span aria-hidden="true">*</span></label>
                  <input type="text" name="name" required />
                  
                    <label for="title">Name of item<span aria-hidden="true">*</span></label>
                    <input type="text" name="title" required />
                    <label for="product_type">Choose product type<span aria-hidden="true">*</span></label>
                    <select id="product_type" name="product_type" form="add-item" required>
                      <option value="trousers">Trousers</option>
                      <option value="top">Tops</option>
                      <option value="dress">Dresses</option>
                      <option value="footwear">Footwear</option>
                      <option value="accessories">Accessories</option>
                      <option value="other">Other</option>
                    </select>
                    <label for="description">Description of item<span aria-hidden="true">*</span></label>
                    <input
                      type="text"
                      name="description"
                      required
                    />
                    <label for="price">Price<span aria-hidden="true">*</span></label>
                    <input
                      type="number"
                      name="price"
                      required
                    />            <button type="submit" id="add-item-btn" class="btn">Add item</button>
                  </form>  
                  <ul class="item-list">${itemsList}</ul>    
                  </section>
          </body>
        </html>`
        );
      });
    } else {
      response.redirect("/");
    }
  });
}

function post(request, response) {
  // collect user input from request body
  // console.log(request.body);
  // console.log(request.body.title);
  // const title = request.body.title;
  const { name, title, product_type, description, price } = request.body;

  model
    .addItem(name, title, product_type, description, price)
    .then((result) => {
      response.redirect("/newsfeed");
    })
    .catch((error) => {
      console.log(error);
      response.redirect("/");
    });
}

module.exports = { get, post };
