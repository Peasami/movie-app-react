const pgPool = require("./connection");
const {deleteFavourite} = require("./favourite");
const {deleteReview} = require("./reviews")
const {RemoveUser,deleteJoinRequest} = require("./groups")
const{DeleteNews} = require("./news")

const sql = {
  REGISTER_USER: 'INSERT INTO account (username, pw) VALUES ($1, $2)',
  GET_PW: 'SELECT pw FROM account WHERE username=$1',
  DELETE_USER:"DELETE FROM account WHERE account_id = $1"
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
const deleteAccount = async (account_id) => {
  try {
    await deleteReview(account_id);
    await deleteFavourite(account_id);
    await RemoveUser(account_id);
    await deleteJoinRequest(account_id);
    await DeleteNews(account_id);

   
    
    const result = await pgPool.query(sql.DELETE_USER, [account_id]);

    if (result.rows.length > 0) {
      return result.rows[0].pw;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error; 
  }
  

};
//deleteAccount(11);
module.exports={register, checkLogin, deleteAccount};