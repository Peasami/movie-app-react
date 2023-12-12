const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken, auth} = require('../Auth/auth');

const {getNews,addNews,deleteNews} = require('../postgre/news')

router.post("/AddNews/:account_id", upload.none(), async (req,res) =>{
    const account_id = req.params.account_id;
    const community_id = req.body.community_id;
    const news_url = req.body.news_url;
        try {
            const result = await addNews(account_id, community_id, news_url);
            res.end();
        } catch (error) {
            console.error("Error executing query:", error);
           
        }
    });
    
//hakee ryhmälle uutiset 
router.get('/groupNews', upload.none() ,async (req, res) =>{
    try{
        const result  = await getNews(community_id);
        res.json(result);
    }
    catch (error) {
        console.error("Error executing query:", error);
        
    }

});
module.exports = router;