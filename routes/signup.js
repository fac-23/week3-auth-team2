const auth = require("../auth.js");

function get(request, response) {
  const html = `<!DOCTYPE html>
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
			<h1>Sign up</h1>
			<form action="/signup" method="POST" class="flex">
				<label for="name">Username<span aria-hidden="true">*</span></label>
				<input type="text" name="name" required />

				<label for="email">Email<span aria-hidden="true">*</span></label>
				<input type="email" name="email" required />

				<label for="password">Password<span aria-hidden="true">*</span></label>
				<div id="passwordRequirements">
					Passwords must contain at least one letter and one number, and contain
					at least 8 characters.
				</div>
				<input
					type="password"
					name="password"
					aria-describedby="passwordRequirements"
                  
                    minlength="8"
					required
				/>
				<button type="submit" class="btn">Sign up</button>
				<a id="back-home" href="/" class="btn">Back to home</a>
			</form>
			
		</section>
		
	</body>
</html>`;

  response.send(html);
}

function post(request, response) {
  // collect user input from request body
  const { name, email, password } = request.body;
  console.log("post request body", request.body);
  // hash the password and call model.createUserDB
  // insert user into db and return the first row of db table (name, email, hash)
  auth
    .createUser(name, email, password)
    // generates sid and calls model.createSession
    // insert sid and user data into sessions table and returns sid column of sessions table
    .then(auth.saveUserSession)
    // set a cookie with the name 'sid' and value of sid and pass cookie options
    .then((sid) => {
      response.cookie("sid", sid, auth.COOKIE_OPTIONS);
      response.redirect("/login");
    })
    .catch((error) => {
      console.error(error);
      response.send(`<h1>Something went wrong, sorry</h1>`);
    });
}

module.exports = { get, post };
