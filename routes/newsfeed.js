// for the get request: check if user is logged in and redirect to newsfeed
// if not signed up or logged in - redirect to homepage

// const { listenerCount } = require("process");
const db = require("../database/connection.js");
const model = require("../database/model.js");

function get(request, response) {

  db.query("SELECT * FROM products").then((result) => {
    const items = result.rows;
    
    // console.log("items added",items);
    const itemsList = items.map((item) => 
      `<li class="item">
      <div>
        <h2 class="item-title">${item.title}</p>
        <p>${item.product_type}</p>
        <p>${item.description}</p>
        <p>${item.price}</p>
      </div>
    </li>`
    ).reverse().join("");
  
    response.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="./style.css" />
        <title>DevPop</title>
    </head>
    <body>
        <section>
            <h1>DevPop Feed</h1>
            <p id="user-name-display"></p>
            <section id="news-feed-container">
            <h1>Add your item</h1>
            <form action="/newsfeed" method="POST" id="add-item">

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
              />            <button type="submit" id="add-item-btn">Add item</button>
            </form>  
            <ul class="wrapper">${itemsList}</ul>    
            </section>
    </body>
  </html>`);
  
  });
}

function post(request, response) {
  // collect user input from request body
  // console.log(request.body);
  // console.log(request.body.title);
  // const title = request.body.title;
  const {name, title, product_type, description, price } = request.body;
  model.addItem(name, title, product_type, description, price);
  response.redirect("/newsfeed");
}

module.exports = { get, post };
