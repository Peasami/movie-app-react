const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken, auth } = require('../Auth/auth');

const {getGroups,CreateGroup,getGroupUsers} = require('../postgre/groups');

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
        const username = res.locals.username;
        const adminId = req.body.adminId;
        const groupId = req.body.groupId;
        const groupName = req.body.groupName;

        const userInfo = [username,adminId,groupId,groupName];
        
        // await CreateGroup(admin_id,community_name,community_desc);
        res.status(200).json({username: username, personalData: "Some personal data", userInfo: userInfo});
    } catch(error){
        console.log("Error executing query:", error)
        
    }
});

module.exports = router;