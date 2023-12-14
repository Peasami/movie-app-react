require('dotenv').config();
const express = require('express');
const accountRoute = require('./routes/account');
const groupsRoute = require('./routes/groups');
const reviewRoute = require('./routes/reviews');
const groupRoute = require('./routes/group');
const newsRoute = require('./routes/news');



const cors = require('cors');



const app = express();

const path = require('path');
app.get("/*", function (req, res) {
    res.sendFile(
        path.join(__dirname, "public/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    )
});

//Setting middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

//Setting routes
app.use('/account', accountRoute );
app.use('/groups', groupsRoute );
app.use('/reviews',reviewRoute );
app.use('/group', groupRoute );
app.use('/news', newsRoute );

//Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, function(){
    console.log('Server running on port ' + PORT);
} );

// export app for testing
module.exports = app;