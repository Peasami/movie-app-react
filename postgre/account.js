const pgPool = require("./connection");

const sql = {
  INSERT_USER: 'INSERT INTO account (username, pw) VALUES ($1, $2)'
};


registerUser('', '');

async function registerUser(username, pw) {
  await pgPool.query(sql.INSERT_USER, [username, pw]);
}