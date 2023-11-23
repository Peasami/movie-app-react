const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken } = require('../Auth/auth');

const {getGroups,CreateGroup,getGroupUsers} = require('../postgre/groups');

router.get("/getGroups", upload.none(), async (req,res) =>{
    try {
        const result = await getGroups();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query:", error);
        
    }
});

router.post("/createGroup", upload.none(), async (req,res) =>{
    const admin_id = req.body.admin_id;
    const community_name = req.body.community_name;
    const community_desc = req.body.community_desc;
    try {
        await CreateGroup(admin_id,community_name,community_desc);
        res.end();
    } catch(error){
        console.log("Error executing query:", error)
        
    }
});

module.exports = router;