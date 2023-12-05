const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken, auth } = require('../Auth/auth');

const {getGroups,CreateGroup,getGroupUsers, joinRequest, getRequests, getYourGroups, acceptRequest, rejectRequest} = require('../postgre/groups');

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

router.get("/getRequests/:adminId", auth, async (req,res) => {
    try{
        const result = await getRequests(req.params.adminId);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({error: error});
    }
});

router.get("/getYourGroups/:adminId", async (req,res) => {
    try{
        const result = await getYourGroups(req.params.adminId);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({error: error});
    }
});

router.put("/acceptRequest/:requestId", async (req,res) => {
    try{
        const result = await acceptRequest(req.params.requestId);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({error: error});
    }
});

module.exports = router;