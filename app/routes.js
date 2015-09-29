// node-soap functionality ***********************
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var fs = require('fs');
var NodeCache = require( "node-cache" );
var bcrypt    = require('bcrypt-nodejs');

var db;
var MongoClient = require('mongodb').MongoClient;

var apiKey = 'f117b20a12efc3c4c456d7dd24189';

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/usersdb", function(err, database) {
  if(err) { 
    return console.dir(err); 
} else
    db = database;
});

// expose the routes to our app with module.exports
module.exports = function(app) {

/* GET Homepage. */
app.get('/api/homepage', function(req, res) {
    var response = {
      username: 0
    };

    if(req.session.username)
        response.username = req.session.username;
    res.json(response);
});

/* POST Login page. */
app.post('/api/login', function(req, res) {
    var collection = db.collection('userscollection');

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userPassword = req.body.password;

    collection.findOne({username:userName, password:userPassword}, function(err, results) {
        if(err) throw err;

        if (results == null) {
            console.log('not connected');
            res.redirect('/register');
        } else {
            console.log('connected');
            req.session.username = req.body.username;
            console.log('session was opened');
            res.redirect('/homepage');
        }        
    });
});

/* POST Register page. */
app.post('/api/register', function(req, res) {
    var collection = db.collection('userscollection');

    //Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userPassword = req.body.password;
    var userEmail = req.body.email;

    // console.log(userName);
    // console.log(userPassword);
    // console.log(userEmail);

    // Submit to the DB
    collection.insert({username: userName, password: userPassword, email: userEmail}, 
    function(err, item) {
          if (err) throw err;

          res.redirect('/userlist' );
       });
});

/* GET Profile page. */
app.get('/api/profile', function(req, res) {
    var userName = req.session.username;
    var collection = db.collection('userscollection');

    collection.findOne({username:userName}, function(err, results) {
        if(err) throw err;

        if (results == null) {
            console.log('user not found');
        } else {
            res.json(results);
        }        
    });
}); 
      
/* GET Logout. */
app.get('/api/logout', function (req, res) {
    req.session.destroy(function (err) {
        if(err) throw err;
        
        res.redirect('/homepage');
    });
})  

/* application */
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

};