const pgPool = require("./connection");

const sql = {
  REGISTER_USER: 'INSERT INTO account (username, pw) VALUES ($1, $2)',
  GET_PW: 'SELECT pw FROM account WHERE username=$1',
  GET_FAVOURITE: "SELECT movie_id FROM favourite WHERE account_id = $1",
  POST_FAVOURITE: "INSERT INTO favourite (movie_id, account_id) VALUES ($1,$2)"
};




async function register(username, pw) {
  await pgPool.query(sql.REGISTER_USER, [username, pw]);
}



async function checkLogin(username){
  const result = await pgPool.query(sql.GET_PW, [username]);

  if(result.rows.length > 0){
      return result.rows[0].pw;
  }else{
      return null;
  }
}

//getFavourite(9);

async function getFavourite(account_id){
  try {
    const result = await pgPool.query(sql.GET_FAVOURITE, [account_id]);
    const rows = result.rows;
    return console.log(rows);
    
} catch (error) {
    console.error("Error executing query:", error);
}
}

async function postFavourite(movie_id,account_id){
  await pgPool.query(sql.POST_FAVOURITE, [movie_id,account_id]);
}


module.exports={register, checkLogin};