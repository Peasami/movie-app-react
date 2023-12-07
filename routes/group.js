const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest:'upload/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken, auth } = require('../Auth/auth');

router.get("/authorize", auth, async (req,res) =>{
    res.status(200).send('Authorized');
});


module.exports = router;