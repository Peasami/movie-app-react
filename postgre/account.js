const pgPool = require("./connection");
const {deleteFavourite} = require("./favourite");
const {deleteReview} = require("./reviews")
const {removeUser,deleteJoinRequest,deleteGroup,removeGroupUsers, getCommunityAdmin,determineIfAdminLogic} = require("./groups")
const{deleteNews} = require("./news")


const sql = {
  REGISTER_USER: 'INSERT INTO account (username, pw) VALUES ($1, $2)',
  GET_PW: 'SELECT pw FROM account WHERE username=$1',
  GET_USER_ID: 'SELECT account_id FROM account WHERE username=$1',
  DELETE_USER:"DELETE FROM account WHERE account_id = $1",
  //REMOVE_ACCOUNTS_FROM_COMMUNITY: "SELECT * FROM community JOIN account ON community.admin_id = account.account_id WHERE account.account_id =$1 "

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
async function deleteAccount(account_id) {
  //tarkistaa onko käyttäjän account_id sama kuin admin_id ja jos se on niin ajaa for osan.
  const { isAdmin, communityIds } = await determineIfAdminLogic(account_id);

  if (isAdmin) {
    
    for (const community_id of communityIds) {
      await removeUser(community_id);
      await deleteGroup(account_id, community_id);
    }

    
    // await pgPool.query(sql.REMOVE_ACCOUNTS_FROM_COMMUNITY, [account_id]);
  }

  
  await removeGroupUsers(account_id);
  await deleteReview(account_id);
  await deleteFavourite(account_id);
  //await deleteJoinRequest(account_id);
  await deleteNews(account_id);
  
  //poistaa käyttäjän account taulusta ja lopullisesti.
  await pgPool.query(sql.DELETE_USER, [account_id]);
  
  console.log("Käyttäjän poistaminen onnistui");
}


//deleteAccount(31);
// Returns account_id of username
async function getUserId(username){
  const result = await pgPool.query(sql.GET_USER_ID, [username]);

  if(result.rows.length > 0){
      return result.rows[0].account_id;
  }else{
      return null;
  }
}

module.exports={register, checkLogin, deleteAccount, getUserId};