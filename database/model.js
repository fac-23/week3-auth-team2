const db = require("./connection.js");

function createUserDB(name, email, hash) {
  const INSERT_USER = `
    INSERT INTO devpop_users (name, email, password) VALUES ($1, $2, $3)
    RETURNING id, name, email
  `;
  return db.query(INSERT_USER, [name, email, hash]).then((result) => {
    // console.log("createUserDb", result.rows[0]);
    return result.rows[0];
  });
}

function createSession(sid, data) {
  const INSERT_SESSION = `INSERT INTO sessions
    (sid, data) VALUES ($1, $2) RETURNING sid`;
  return db.query(INSERT_SESSION, [sid, data]).then((result) => {
    // console.log("create sid", result.rows[0].sid);
    return result.rows[0].sid;
  });
}

function addItem(name, title, product_type, description, price) {
  // console.log("addItem name:", name);
  //  query the db to select the id from users table where the name of the user equals the name input by users
  const SELLER_ID = `SELECT id FROM devpop_users WHERE devpop_users.name = ($1)`;
  return db.query(SELLER_ID, [name]).then((result) => {
    // result is a postgres object returned from the db query, from which we take the user id
    // console.log(result);
    const INSERT_ITEM = `INSERT INTO products(name, title, product_type, description, price, seller_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING name,title, product_type, description, price`;
    return db
      .query(INSERT_ITEM, [
        name,
        title,
        product_type,
        description,
        price,
        // the seller id from the users table to insert into products table
        result.rows[0].id,
      ])
      .then((result) => {
        // console.log("items added to db", result.rows[0]);
        return result.rows[0];
      });
  });
}

function getUser(email) {
  //SQL command to select ID, email, password and name
  //from devpop users table where email matches user input
  const SELECT_USER = `
  SELECT id, name, email, password FROM devpop_users WHERE email = $1`;
  //santizes email to stop SQL injection checks DB for email
  return db.query(SELECT_USER, [email]).then((result) => {
    // console.log("getUser", result.rows[0]);
    return result.rows[0];
  });
}

function getSession(sid) {
  const SELECT_SESSION = `SELECT data FROM sessions WHERE sid=$1`;

  return db.query(SELECT_SESSION, [sid]).then((result) => {
    const singleResult = result.rows[0];
    // console.log("get session", singleResult, singleResult.data);
    return singleResult && singleResult.data;
  });
}

function deleteSession(sid) {
  const DELETE_SESSION = `DELETE FROM sessions WHERE sid=$1`;
  return db
    .query(DELETE_SESSION, [sid])
    .then((result) => console.log("deleted from table"));
}

function deleteItem(id) {
  const DELETE_ITEM = `DELETE FROM products WHERE id=$1`;
  return db
    .query(DELETE_ITEM, [id])
    .then((result) => console.log("deleted from table"));
}

module.exports = {
  createUserDB,
  createSession,
  getUser,
  getSession,
  addItem,
  deleteSession,
  deleteItem,
};
