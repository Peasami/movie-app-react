const pgPool = require("./connection");

const sql = {
  REGISTER_USER: 'INSERT INTO account (username, pw) VALUES ($1, $2)',
  GET_PW: 'SELECT pw FROM account WHERE username=$1',
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

module.exports={register, checkLogin};