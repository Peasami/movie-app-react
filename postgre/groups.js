const pgPool = require("./connection");

const sql = {
  GET_GROUPS: "SELECT * FROM community",
  CREATE_GROUP: "INSERT INTO community(admin_id, community_name,community_desc) VALUES ($1, $2, $3) ",
  GET_GROUP_USERS: "SELECT account.username FROM account JOIN account_community ON account.account_id = account_community.account_id JOIN community ON account_community.community_id = community.community_id WHERE community.community_id = $1",
  REMOVE_USER: "DELETE from account_community WHERE account_id = $1",
  ADD_USER: "INSERT INTO account_community(account_id, community_id) VALUES ($1, $2)",
 
  GROUP_JOIN_REQEUST: "INSERT INTO request (account_id, community_id) VALUES ($1, $2)",
  DELETE_JOIN_REQUEST: "DELETE from request WHERE account_id = $1"
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
async function removeUser(account_id){
    await pgPool.query(sql.REMOVE_USER, [account_id]);
}
//suorittaa liittymispyynnön ryhmään.
async function joinRequest(account_id, community_id) {
    try {
        await pgPool.query(sql.GROUP_JOIN_REQEUST, [account_id,community_id]);
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

//poistaa liittymispyynnön, poistaessa käyttäjän.
async function deleteJoinRequest(account_id){
    await pgPool.query(sql.DELETE_JOIN_REQUEST,[account_id]);
}

//lisää käyttäjän ryhmään
//lisää välitaulun "account_community".
async function addUser(account_id, community_id){
    try {
        await pgPool.query(sql.ADD_USER, [account_id, community_id]);
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

module.exports= {getGroups,CreateGroup,getGroupUsers, removeUser, deleteJoinRequest,joinRequest, addUser};