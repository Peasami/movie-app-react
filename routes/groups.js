const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken, auth } = require('../Auth/auth');

const {getGroups,CreateGroup,getGroupUsers, joinRequest,getAdmin, getGroup, getRequests, getYourGroups, acceptRequest, rejectRequest} = require('../postgre/groups');
const { getNews } = require('../postgre/news');

router.get("/getGroups", upload.none(), async (req,res) =>{
    try {
        const result = await getGroups();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query:", error);
        
    }
});

router.post("/createGroup", auth, async (req,res) =>{
    try {
        const groupInfo = {
            adminId: req.body.adminId,
            groupDesc: req.body.groupDesc,
            groupName: req.body.groupName
        }

        
        
        await CreateGroup(groupInfo.adminId,groupInfo.groupName,groupInfo.groupDesc);
        res.status(200).json({ groupInfo: groupInfo});
    } catch(error){
        console.log("Error executing query:", error)
        
    }
});

router.post("/addRequest", auth, async (req,res) =>{
    try {
        const requestBody = {
            accountId: req.body.accountId,
            groupId: req.body.groupId
        }

        await joinRequest(requestBody.accountId, requestBody.groupId);
        res.status(200).json({ requestBody: requestBody});
    } catch (error) {
        console.log("Error executing query:", error)
    }
});
//Ryhmän Sivu
router.get("/:community_id",upload.none(), async (req,res) =>{
try {
    const community_id = req.params.community_id
    const adminUsername =  await getAdmin(community_id);
    const admin = adminUsername.rows[0];
    const CommunityInfo = await getGroup(community_id);
    const Community = CommunityInfo.rows
    const GroupUsernames = await getGroupUsers(community_id);
    const Users = GroupUsernames.rows
    const filteredUsers = Users.filter(user => user.username !== admin.username);
    const groupNews = await getNews(community_id);
    const news = groupNews.rows;
    
    res.json({ Community,admin, Users:filteredUsers, news});
   
} catch(error){
    console.log("Error executing query:", error)
    
}
});
// get all pending requests for groups where the user is admin
router.get("/getRequests/:adminId", auth, async (req,res) => {
    try{
        const result = await getRequests(req.params.adminId);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({error: error});
    }
});

// get groups where the user is admin
router.get("/getYourGroups/:adminId", async (req,res) => {
    try{
        const result = await getYourGroups(req.params.adminId);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({error: error});
    }
});

// accept request by updating "pending" -column to false
router.put("/acceptRequest/:requestId", async (req,res) => {
    try{
        const result = await acceptRequest(req.params.requestId);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({error: error});
    }
});

// reject request by deleting it from database
router.delete("/rejectRequest/:requestId", auth, async (req,res) => {
    try {
        const result = await rejectRequest(req.params.requestId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: error});
    }
});

module.exports = router;