const auth = require("../auth.js");

function get(request, response) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" type="text/css" href="./style.css" />
            <title>DevPop</title>
        </head>
        <body>
            <section class="flex">
                <div class="logo"></div>
                <h1>Log in</h1>
                <form action="/login" method="POST" class="flex">
                    <label for="email">Email<span aria-hidden="true">*</span></label>
                    <input type="email" name="email" required />
    
                    <label for="password">Password<span aria-hidden="true">*</span></label>
                    <input
                        type="password"
                        name="password"
                        minlength="8"
                        required
                    />
                    <button type="submit" class="btn">Log in</button>
                    <a id="back-home" href="/" class="btn">Back to home</a>
                </form>
                
            </section>
            
        </body>
    </html>`;

  response.send(html);
}

function post(request, response) {
  // collect user input from request body
  const { email, password } = request.body;
  auth
    // verify hashed password matches password input
    // call model.getUser to retrieve user from db based on user email
    .verifyUser(email, password)
    // generates sid and calls model.createSession
    // insert sid and user data into sessions table and
    // returns sid column of sessions table
    .then(auth.saveUserSession)
    .then((sid) => {
      response.cookie("sid", sid, auth.COOKIE_OPTIONS);
      response.redirect("/newsfeed");
    })
    .catch((error) => {
      console.error(error);
      response.send("<h1>User not found</h1>");
    });
}

module.exports = { get, post };
