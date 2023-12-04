const pgPool = require("./connection");

const sql = {
  GET_GROUPS: "SELECT * FROM community",
  CREATE_GROUP: "INSERT INTO community(admin_id, community_name,community_desc) VALUES ($1, $2, $3)",
  GET_GROUP_USERS: "SELECT account.username FROM account JOIN account_community ON account.account_id = account_community.account_id JOIN community ON account_community.community_id = community.community_id WHERE community.community_id = $1",
  
  ADD_USER: "INSERT INTO account_community(account_id, community_id, pending) VALUES ($1, $2, false)", // välitaulu, pending=false
  ADD_REQUEST: "INSERT INTO account_community(account_id, community_id, pending) VALUES ($1, $2, true)", // välitaulu, pending=true

  ACCEPT_REQUEST: "UPDATE account_community SET pending = false WHERE account_id = $1 AND community_id = $2",
  GROUP_JOIN_REQEUST: "INSERT INTO request (account_id, community_id) VALUES ($1, $2)", // deprecated
  DELETE_JOIN_REQUEST: "DELETE from request WHERE account_id = $1", // deprecated
  REMOVE_USER: "DELETE FROM account_community WHERE account_id = $1",
  REMOVE_USERS: "DELETE FROM account_community WHERE community_id = $1",
  DELETE_GROUP: "DELETE FROM community WHERE admin_id = $1 AND community_id =$2",
  GROUP_JOIN_REQEUST: "INSERT INTO request (account_id, community_id VALUES ($1, $2)",
  //DELETE_JOIN_REQUEST: "DELETE from request WHERE account_id = $1",
  CHECK_ADMIN: "SELECT * FROM community WHERE admin_id = $1",

  GET_REQUESTS: "SELECT account_community.community_id, account_community_id, community.community_id, community.community_name,\
    account.account_id, account.username, community.admin_id\
    FROM account_community\
    JOIN account ON account_community.account_id = account.account_id\
    JOIN community ON account_community.community_id = community.community_id\
    WHERE community.admin_id = $1 AND account_community.pending = true",
  GET_YOUR_GROUPS: "SELECT * FROM community WHERE admin_id = $1"
};

//getGroups();
async function getGroups() {
    try {
        const result = await pgPool.query(sql.GET_GROUPS);
        
        const rows = result.rows;
        //console.log(rows);
        return result;
        
    } catch (error) {
        console.error("Error executing query:", error);
    }
}
//Antaa arvot 
//CreateGroup("8", "Horror movie fans","Fan group for horror movies" );
//console.log("Group created");

async function CreateGroup(admin_id, community_name, community_desc){
 await pgPool.query(sql.CREATE_GROUP, [admin_id, community_name, community_desc]);

}

//deleteGroup(40);
async function removeGroupUsers(account_id) {
    try {
        
            
            await pgPool.query(sql.REMOVE_USER, [account_id]);
       
    } catch (error) {
        console.error('Error removing group users:', error);
        throw error;
    }
}



async function deleteGroup(account_id,community_id){
    await pgPool.query(sql.DELETE_GROUP, [account_id, community_id]);
}
//hakee käyttäjät community_id avulla.
//getGroupUsers(1)
async function getGroupUsers(community_id) {
    try {
        const result = await pgPool.query(sql.GET_GROUP_USERS, [community_id]);
        const rows = result.rows;
        return console.log(rows);
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

//poistaa käyttäjän account taulusta.
async function removeUser(community_id){
    await pgPool.query(sql.REMOVE_USERS, [community_id]);

}

//liittymispyyntö
//tekee välitaulun "account_community", pending = true
async function joinRequest(account_id, community_id) {
    try {
        await pgPool.query(sql.ADD_REQUEST, [account_id,community_id]);
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

//poistaa liittymispyynnön, poistaessa käyttäjän.
//async function deleteJoinRequest(account_id){
   // await pgPool.query(sql.DELETE_JOIN_REQUEST,[account_id]);
//}

const determineIfAdminLogic = async (account_id) => {
    console.log("Checking admin for account_id:", account_id);
    const result = await pgPool.query(sql.CHECK_ADMIN, [account_id]);
    const isAdmin = result.rows.length > 0;
  const communityIds = isAdmin ? result.rows.map(row => row.community_id) : [];
  console.log("käyttäjälle löydettiin groupit jossa se on admin =" +communityIds);

  return { isAdmin, communityIds };
};
//lisää käyttäjän suoraan ryhmään
//tekee välitaulun "account_community", pending = false
async function addUser(account_id, community_id){
    try {
        await pgPool.query(sql.ADD_USER, [account_id, community_id]);
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

//gets all requests for admin
async function getRequests(admin_id){
    const result = await pgPool.query(sql.GET_REQUESTS, [admin_id]);
    return result.rows;
}

//gets groups where user is admin
async function getYourGroups(admin_id){
    const result = await pgPool.query(sql.GET_YOUR_GROUPS, [admin_id]);
    return result.rows;
}

module.exports= {getGroups,CreateGroup,determineIfAdminLogic,getGroupUsers, removeUser,joinRequest, deleteGroup, removeGroupUsers, addUser, getRequests, getYourGroups};
