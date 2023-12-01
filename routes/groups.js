const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken, auth } = require('../Auth/auth');

const {getGroups,CreateGroup,getGroupUsers, joinRequest, getRequests} = require('../postgre/groups');

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

router.get("/getRequests/:adminId", async (req,res) => {
    try{
        const result = await getRequests(req.params.adminId);
        res.status(200).json(result);
    }catch(error){
        console.log("Error executing query:", error)
    }
});

module.exports = router;