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

router.post("/login", upload.none(), async (req, res) => {
    console.log("Received POST request on /login");

    const username = req.body.username;
    const pw = req.body.pw;

    try {

        const pwhashpromise = checkLogin(username);
        const pwhash = await pwhashpromise;

        if (pwhash) {

            console.log("user gave Password:", pw);
            console.log("Stored Hashed Password:", pwhash);
            const isCorrect = await bcrypt.compare(pw, pwhash);

            if (isCorrect) {

                const token = jwt.sign({username: username}, process.env.JWT_SECRET_KEY);
                res.status(200).json({ jwtToken: token });
            } else {

                res.status(401).json({ error: "Incorrect password" });
            }
        } else {

            res.status(401).json({ error: "Username not found" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;