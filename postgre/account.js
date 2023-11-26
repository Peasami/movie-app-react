const pgPool = require("./connection");
const {deleteFavourite} = require("./favourite");
const {deleteReview} = require("./reviews")
const {removeUser,deleteJoinRequest} = require("./groups")
const{deleteNews} = require("./news")

const sql = {
  REGISTER_USER: 'INSERT INTO account (username, pw) VALUES ($1, $2)',
  GET_PW: 'SELECT pw FROM account WHERE username=$1',
  DELETE_USER:"DELETE FROM account WHERE account_id = $1"
};


//register("petteri", "kissa");
async function register(username, pw) {
  await pgPool.query(sql.REGISTER_USER, [username, pw]);
}



async function checkLogin(username){
  const result = await pgPool.query(sql.GET_PW, [username]);

  if(result.rows.length > 0){
    console.log("Found username:", username);
    return result.rows[0].pw;
  } else {
    console.log("Username not found:", username); // Add console.log here
    return null;
  }
}

//functio, joka ajaa alla olevat functiot, kun käyttäjä poistaa tilinsä.
const deleteAccount = async (account_id) => {
  try {
    await deleteReview(account_id);
    await deleteFavourite(account_id);
    await removeUser(account_id);
    await deleteJoinRequest(account_id);
    await deleteNews(account_id);

   
    
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
//deleteAccount(31);
module.exports={register, checkLogin, deleteAccount};