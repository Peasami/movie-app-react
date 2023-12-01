const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken, auth} = require('../Auth/auth');

const {getNews,addNews,deleteNews} = require('../postgre/news')

//listää uutisen 
router.post("/AddNews", upload.none(), async (req,res) =>{
    try {
        const result = await addNews();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query:", error);
        
    }
});
//hakee ryhmälle uutiset 
router.get('/groupNews', upload,none() ,async (req, res) =>{
    try{
        const result  = await getNews(community_id);
        res.json(result);
    }
    catch (error) {
        console.error("Error executing query:", error);
        
    }

});