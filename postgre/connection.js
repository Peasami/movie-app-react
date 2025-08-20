require("dotenv").config();
const { Pool } = require("pg");

console.log("password:", process.env.PG_PW);
console.log("database:", process.env.PG_DB);

const pgPool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DB,
  user: process.env.PG_USER,
  password: process.env.PG_PW, 
  ssl: false
 

});
pgPool.connect((err) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err.message);
  } else {

    console.log("Connected to PostgreSQL!");


  }
});
module.exports =pgPool;