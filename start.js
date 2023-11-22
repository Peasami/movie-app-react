require('dotenv').config();
const express = require('express');
const accountRoute = require('./routes/account');
const cors = require('cors');

const app = express();

//Setting middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

//Setting routes
app.use('/account', accountRoute );

//Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, function(){
    console.log('Server running on port ' + PORT);
} );


app.post('/register' ,(req,res) => {

    const username = req.body.username;
    const pw = req.body.pw;

    console.log(username);
    console.log(pw);

    res.send('Post working');
});