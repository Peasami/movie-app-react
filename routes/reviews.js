const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken, auth} = require('../Auth/auth');

const{getReviews, getReview, postReview, deleteReview} = require('../postgre/reviews')


    //Täällä voidaan selata kaikkia arvosteluita, eri elokuvista, ilman kirjautumista.
router.get("/getReviews", upload.none(), async (req,res) =>{
    try {
        const result = await getReviews();
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query:", error);
        
    }
});
    //osoite, jossa tehdään post komento, jossa ajetaan functio postReview
router.post("/Review/:account_id", upload.none(), async (req,res) =>{
        const account_id = req.params.account_id;
        const text = req.body.text
        const movie_id = req.body.movie_id
        const rating = req.body.rating
        try {
        const result = await postReview(account_id, text, movie_id, rating);
        res.end();
    } catch (error) {
        console.error("Error executing query:", error);
        
    }
});

router.get("/Review/:account_id", auth async (req, res) => {
    const account_id = req.params.account_id;
    try {
        const result = await getReview(account_id);
        res.json(result.rows);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "Internal Server Error" }); // You can customize the error response as needed
    }
});
module.exports = router;