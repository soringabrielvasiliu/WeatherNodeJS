// node-soap functionality ***********************
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var fs = require('fs');
var NodeCache = require( "node-cache" );
var bcrypt    = require('bcrypt-nodejs');
var request = require('request');

var db;
var MongoClient = require('mongodb').MongoClient;

var apiKey = 'f117b20a12efc3c4c456d7dd24189';

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/weather", function(err, database) {
  if(err) { 
    return console.dir(err); 
} else
    db = database;
});

function daysOfWeek(dayIndex) {
    return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][dayIndex];
}

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
    var collection = db.collection('users');

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userPassword = req.body.password;
    var   loginErrorCode = 0;
    console.log(userName + "\t " + userPassword);

    collection.findOne({username:userName}, function(err, results) {
        if(err) throw err;
        console.log(results.username);

        if (results == null || (!bcrypt.compareSync(userPassword, results.password)) ) {
            console.log('not connected');
            loginErrorCode = 1; // no such username
            res.redirect('/login?error=' + loginErrorCode);
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
    var collection = db.collection('users');

    //Get our form values. These rely on the "name" attributes
    var userName     =   req.body.username;
    var userPassword =   bcrypt.hashSync(req.body.password);
    var userEmail    =   req.body.email;
    var registerErrorCode = 0;
    // Submit to the DB
    if (userName == '' || userPassword == '' || userEmail == '') {
        registerErrorCode = 3;
         res.redirect('/register?error=' + registerErrorCode);
     } else {
     collection.findOne({email:userEmail}, function(err, item) {
          if (err) throw err;
          if (item != null) {
            registerErrorCode = 1; //email used
            res.redirect('/register?error=' + registerErrorCode);
          } else {
              collection.findOne({username:userName}, function(err, item) {
                  if (err) throw err;
                  if (item != null) {
                    registerErrorCode = 2; //username used
                    res.redirect('/register?error=' + registerErrorCode);
                  } else {
                        collection.insert({username: userName, password: userPassword, email: userEmail}, 
                        function(err, item) {
                              if (err) throw err;
                              req.session.username = userName;
                              res.redirect('/homepage' );
                           });
                    }
                });
            }
    });
 }
 });

/* GET Profile page. */
app.get('/api/profile', function(req, res) {
    var userName = req.session.username;
    var collection = db.collection('users');

    collection.findOne({username:userName}, function(err, results) {
        if(err) throw err;

        if (results == null) {
            res.redirect("/login");
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
}); 
app.get('/api/homepage', function(req, res) {
  var response = {
    username : 0
  };

  var collection = db.collection('users');

  if (req.session.username != null) {// session is opened
    response.username = req.session.username;
        res.json(response);
    }
  
  else {
        res.json(response);
  }
});

app.get('/api/weather', function (req, res) {
    request('https://api.worldweatheronline.com/free/v2/weather.ashx?q=Iasi&num_of_days=5&tp=24&format=json&key=aa15be85bf9357ca90f879405497d', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            if (result.data && typeof result.data.error === 'undefined') {
                result.data.weather.forEach(function(day) {
                    day.dayOfWeek = daysOfWeek(new Date(day.date).getDay() - 1);
                });
            }
            res.send(result.data);
        } else {
            console.log(error, response.statusCode, body);
        }
        res.end("");
    });
});

/* application */
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

};