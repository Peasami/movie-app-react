// register, login and profile view
const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth } = require('../Auth/auth');
const { createToken } = require('../Auth/auth');

const {getFavourites, addFavourite,deleteFavourite} = require ('../postgre/favourite');
const {register,checkLogin, deleteAccount,getUserId, Userpage,} = require('../postgre/account');
const { getCommunityAdmin } = require('../postgre/groups');


router.post("/register", upload.none(), async (req,res) =>{
    const username = req.body.username;
    let pw = req.body.pw;
    
    pw = await bcrypt.hash(pw,10);
    try {
        await register(username,pw);
        res.status(200).json({message: "Register successful"});
    } catch(error){
        res.status(403).json({ error: "Register error" });
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
            
            const userId = await getUserId(username);
            console.log("userId: ", userId);

            // data to be stored in jwtToken
            const userData = {
                username: username,
                userId: userId
            };

            const isCorrect = await bcrypt.compare(pw, pwhash);
            
            if (isCorrect) {

                const token = jwt.sign(userData, process.env.JWT_SECRET_KEY);
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


// Returns personal data of user
// token is checked with auth middleware
router.get('/getUserInfo', auth, async (req,res)=>{
    
    try{
        // res.locals.username is set in auth middleware
        const username = res.locals.username;
        const userId = await getUserId(username);
        res.status(200).json({username: username, userId: userId});
    }catch(err){
        res.status(505).json({error: err.message});
    }
});


router.delete("/Delete/:account_id", async (req, res) => {
    console.log("Received delete request on ");
    try {
        const account_id = req.params.account_id;
        
        await deleteAccount(account_id);
        res.status(200).json({ message: "Delete successful" });

        // // Check if result is null or undefined
        // if (result === null || result === undefined) {
        //     res.status(404).json({ error: "Account not found" });
        // } else {
        //     // Check if deletion was successful
        //     if (result.rows && result.rows.length > 0) {
        //         res.status(200).json({ message: "Delete successful" });
        //     } else {
        //         res.status(404).json({ error: "Account not found" });
        //     }
        // }
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.get("/:account_id", upload.none(), async (req,res) =>{
    try {
        const account_id = req.params.account_id;
        const result = await Userpage(account_id);
        
        
        res.json(result);
    } catch (error) {
        console.error("Error executing query:", error);
        
    }
});

router.post("/favourite/:account_id", upload.none(), async (req, res) =>{
    try{
        const account_id = req.params.account_id;
        const movie_id = req.body.movie_id;
        const result = await addFavourite(movie_id,account_id);
        res.json(result.rows);
    } catch(error) { 
        console.error("Error executin query:", error)
    }
});
  
module.exports = router;