const pgPool = require("./connection");
const { groupDeleteNews } = require("./news");

//järkyttävä lista Sql queryja.
const sql = {
  GET_GROUPS: "SELECT * FROM community",
  GET_GROUPS_WITH_ADMIN: "SELECT community.community_id, community_name, community_desc, admin_id, account.username FROM community JOIN account ON community.admin_id = account.account_id",
  GET_1_GROUP: "SELECT community_name, community_desc FROM community WHERE community_id = $1 ",
  CREATE_GROUP: "INSERT INTO community(admin_id, community_name,community_desc) VALUES ($1, $2, $3) RETURNING community_id",
  GET_GROUP_USERS: "SELECT account.username, account.account_id FROM account JOIN account_community ON account.account_id = account_community.account_id JOIN community ON account_community.community_id = community.community_id WHERE community.community_id = $1",
  ADD_USER: "INSERT INTO account_community(account_id, community_id, pending) VALUES ($1, $2, false)", // välitaulu, pending=false
  ADD_REQUEST: "INSERT INTO account_community(account_id, community_id, pending) VALUES ($1, $2, true)", // välitaulu, pending=true
  SELECT_ADMIN: "SELECT account.username, account.account_id FROM account JOIN account_community ON account.account_id = account_community.account_id JOIN community ON account_community.community_id = community.community_id WHERE community.community_id = $1 AND account.account_id = community.admin_id",
  ACCEPT_REQUEST: "UPDATE account_community SET pending = false WHERE account_community_id = $1",
  REJECT_REQUEST: "DELETE FROM account_community WHERE pending = true AND account_community_id = $1",
  REMOVE_USER: "DELETE FROM account_community WHERE account_id = $1",
  REMOVE_USERS: "DELETE FROM account_community WHERE community_id = $1",
  DELETE_GROUP: "DELETE FROM community WHERE admin_id = $1 AND community_id =$2",
  REMOVE_USER_FROM_GROUP: "DELETE FROM account_community WHERE account_id = $1 AND community_id = $2",
  //DELETE_JOIN_REQUEST: "DELETE from request WHERE account_id = $1",
  CHECK_ADMIN: "SELECT * FROM community WHERE admin_id = $1",

  GET_REQUESTS: "SELECT account_community.community_id, account_community_id, community.community_id, community.community_name,\
    account.account_id, account.username, community.admin_id\
    FROM account_community\
    JOIN account ON account_community.account_id = account.account_id\
    JOIN community ON account_community.community_id = community.community_id\
    WHERE community.admin_id = $1 AND account_community.pending = true",
  GET_USERS_GROUPS: "SELECT community.community_id, community_name, community_desc, admin_id, account_community.pending\
    FROM community JOIN account_community ON community.community_id = account_community.community_id WHERE account_community.account_id  =$1",
  GET_MEMBERS: "SELECT account.account_id, account.username FROM account\
    JOIN account_community ON account.account_id = account_community.account_id WHERE community_id = $1 AND pending = false",
};

// Gets all groups
async function getGroups() {
    try {
        const result = await pgPool.query(sql.GET_GROUPS);
        return result;
        
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

// Gets all groups with admin username
async function getGroupsWithAdmin() {
    const result = await pgPool.query(sql.GET_GROUPS_WITH_ADMIN);
    return result
}

// Get group name and desc by community_id
async function getGroup(community_id){
    const result = await pgPool.query(sql.GET_1_GROUP, [community_id]);
    return result;
}

// Creates a group and adds the admin to the group via the account_community table
async function CreateGroup(admin_id, community_name, community_desc) {
  try {
    
    const result = await pgPool.query(sql.CREATE_GROUP, [admin_id, community_name, community_desc]);

    const community_id = result.rows[0].community_id; // Assuming community_id is returned in the result
    console.log('Query vastaus:', result);
    // lisätään saatu admin_id ja community_id, joka saatiin luodessa uusi ryhmä.
    await pgPool.query(sql.ADD_USER, [admin_id, community_id]);
    return result;
  } catch (error) {
    console.error('Error executing CreateGroup:', error);
    throw error; 
  }
}

// Removes user from ALL groups
async function removeGroupUsers(account_id) {
    try { 
            await pgPool.query(sql.REMOVE_USER, [account_id]);
       
    } catch (error) {
        console.error('Error removing group users:', error);
        throw error;
    }
}

// deletes group and all users, pending requests, and news.
async function deleteGroupAndDependencies(account_id,community_id){
    console.log("deleting group")
    const removeUserRes = await removeUser(community_id);
    const removeNewsRes = await groupDeleteNews(community_id);
    const removeGroupRes = await deleteGroup(account_id, community_id);
    console.log("remove user res: " + removeUserRes);
    console.log("group delete news res: " + removeNewsRes);
    console.log("delete group res: " + removeGroupRes);
    return {removeUserRes, removeNewsRes, removeGroupRes};
}

// deletes group, but doesn't delete users or pending requests.
// if you want to delete group completely, use deleteGroupAndDependencies instead.
async function deleteGroup(account_id,community_id){
    const result = await pgPool.query(sql.DELETE_GROUP, [account_id, community_id]);
    return result;
}


// hakee käyttäjät community_id avulla.
// Hakee sekä liittyneet käyttäjät, että käyttäjät jotka ovat lähettäneet liittymispyynnön.
async function getGroupUsers(community_id) {
    try {
        const result = await pgPool.query(sql. GET_USERS_GROUPS, [community_id]);
        return result;
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

// hakee käyttäjät, jotka ovat liittyneet ryhmään.
// Ei hae käyttäjiä, joiden liittymispyyntö on 'pending'
async function getMembers(community_id){
    const result = await pgPool.query(sql.GET_MEMBERS, [community_id]);
    return result;
}


// Gets a group admin's id and username
async function getAdmin(community_id) {
    const result = await pgPool.query(sql.SELECT_ADMIN, [community_id]);
    return result;
}

//poistaa käyttäjän account taulusta.
async function removeUser(community_id){
    result = await pgPool.query(sql.REMOVE_USERS, [community_id]);
    return result;
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

// Returns isAdmin as true if user is admin of any group
// Returns community ids of groups where user is admin
const determineIfAdminLogic = async (account_id) => {
    console.log("Checking admin for account_id:", account_id);
    const result = await pgPool.query(sql.CHECK_ADMIN, [account_id]);
    const isAdmin = result.rows.length > 0;
  const communityIds = isAdmin ? result.rows.map(row => row.community_id) : [];
  console.log("käyttäjälle löydettiin ryhmät jossa se on admin = " +communityIds);

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

//Hakee tiedon käyttäjän ryhmistä, johon hän kuuluu tilin id:n avulla
async function getUsersGroup(account_id) {
    try {
        const result = await pgPool.query(sql.GET_USERS_GROUPS, [account_id]);
        const rows = result.rows;
        return result;
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
    const result = await pgPool.query(sql.GET_USERS_GROUPS, [admin_id]);
    return result.rows;
}

// Accepts pending group join request by updating pending to false
async function acceptRequest(account_community_id){
    const result = await pgPool.query(sql.ACCEPT_REQUEST, [account_community_id]);
    return result;
}

// Rejects pending group join request by deleting it from database
async function rejectRequest(account_community_id){
    await pgPool.query(sql.REJECT_REQUEST, [account_community_id]);
}

// Delete account_community for user and group
async function removeUserFromGroup(account_id, community_id){
    await pgPool.query(sql.REMOVE_USER_FROM_GROUP, [account_id, community_id]);
}

module.exports= {deleteGroupAndDependencies, removeUserFromGroup,getMembers, getGroups,getUsersGroup,getAdmin,getGroup,CreateGroup,determineIfAdminLogic,getGroupUsers, removeUser,joinRequest, deleteGroup, removeGroupUsers, addUser, getRequests, getYourGroups, acceptRequest, rejectRequest, getGroupsWithAdmin};
