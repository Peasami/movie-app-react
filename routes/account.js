// register, login and profile view
const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken } = require('../Auth/auth');

const {getFavourites, addFavourite,deleteFavourite} = require ('../postgre/favourite')
const {register,checkLogin, deleteAccount} = require('../postgre/account');


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

                const token = createToken(username);
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


router.delete("/Delete/:account_id", async (req, res) => {
    console.log("Received delete request on ");

});


router.get("/favourite/:account_id", upload.none(), async (req,res) =>{
    try {
        const account_id = req.params.account_id;
        const result = await getFavourites(account_id);
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query:", error);
        
    }
});
  
module.exports = router;