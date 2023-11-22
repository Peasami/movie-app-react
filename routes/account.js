// register, login and profile view
const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken } = require('../Auth/auth');


const {register,checkLogin} = require('../postgre/account');


router.post("/register", upload.none(), async (req,res) =>{
    const username = req.body.username;
    let pw = req.body.pw;
    
    pw = await bcrypt.hash(pw,10);
    try {
        await register(username,pw);
        res.end();
    } catch(error){
        console.log("Virhe operaatiossa")
        
    }
});

router.post("/login"),upload.none(), async (req,res) => {
    console.log("Received post request on /register")
    const username = req.body.username;
    let pw = req.body.pw
    
    const pwHash = checkLogin(username);
    if (pwHast){
        const isCorrect = await bcrypt.compare(pw,pwHash);
        if(isCorrect) {
            const token = createToken(username);
            res.status(200).json({jwtToken:token});
        } else {
        res.status(401).json({error:"error"});
        }
    } else{
        res.status(401).json({error: "wrong username"})};
};

module.exports = router;