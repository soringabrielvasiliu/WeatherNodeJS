// node-soap functionality ***********************
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var fs = require('fs');
var NodeCache = require( "node-cache" );
var bcrypt    = require('bcrypt-nodejs');
var email =  require('emailjs');

var request     = require('request');
var apiKey      = 'f117b20a12efc3c4c456d7dd24189';
var apiBaseUrl  = 'https://api.worldweatheronline.com/free/v2/weather.ashx';

var db;
var MongoClient = require('mongodb').MongoClient;

var server  = email.server.connect({
   user:    "PopcornFlavorReea@gmail.com", 
   password:"Reea210211", 
   host:    "smtp.gmail.com", 
   tls: {ciphers: "SSLv3"}
});

var message = {
   text:    "Hello! Please follow the steps above to recover your password. Enter the link below http://localhost:7380/changePassword", 
   from:     "PopcornFlavorReea@gmail.com",
   to:     '',
   subject: "Recover password"
};

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/weather", function(err, database) {
  if(err) { 
    return console.dir(err); 
} else
    db = database;
});

function daysOfWeek(dayIndex) {
    return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex];
}

function getRightWeather(req, res) {
    if ( typeof req.body.location === 'undefined' ) location = 'Iasi';
    else location = req.body.location;

    request(apiBaseUrl + '?q=' + location + '&num_of_days=5&tp=24&format=json&key=' + apiKey, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);

            if ( result.data && typeof result.data.error === 'undefined' ) {
                var userId = null;

                if ( typeof req.session.username !== 'undefined') {
                  db.collection('users').findOne({ username: req.session.username }, function(err, results) {
                    userId = results._id;

                    result.data.weather.forEach(function (day) {
                      day.dayOfWeek = daysOfWeek(new Date(day.date).getDay());

                        var collection = db.collection('weathers');
                        collection.find().sort( { _id : -1 } ).limit(1).toArray(function(err, weatherDBData) {
                          if (err)
                            res.send(err);

                          if ( typeof req.body.location !== 'undefined' && ((typeof weatherDBData !== 'undefined' && weatherDBData.length > 0 && weatherDBData[0].location.split(',')[0].toLowerCase() !== req.body.location.toLowerCase()) || (typeof weatherDBData === 'undefined' || weatherDBData.length === 0)) ) {
                            var location  = result.data.request[0].query;
                            var type      = result.data.request[0].type;
                            var date      = day.date;
                            var dayOfWeek = day.dayOfWeek;
                            var maxtempC  = day.maxtempC;
                            var maxtempF  = day.maxtempF;
                            var mintempC  = day.mintempC;
                            var mintempF  = day.mintempF;

                            collection.insert({
                              userId: userId,
                              location: location,
                              type: type,
                              date: date,
                              dayOfWeek: dayOfWeek,
                              maxtempC: maxtempC,
                              maxtempF: maxtempF,
                              mintempC: mintempC,
                              mintempF: mintempF
                            },
                            function(err, item) {
                              if (err) throw err;
                            });
                          }
                        });
                    });

                    res.send(result.data);
                    res.end("");
                  });
                } else {
                  result.data.weather.forEach(function (day) {
                    day.dayOfWeek = daysOfWeek(new Date(day.date).getDay());
                  });

                  res.send(result.data);
                  res.end("");
                }
            } else res.send({cityNotFoundError: 'cityNotFound'});
        } else console.log(error, response.statusCode, body);
    });
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
    var loginErrorCode = 0;
    var   loginErrorCode = 0;

    collection.findOne({username:userName}, function(err, results) {
        if(err) throw err;

        if (results == null || (!bcrypt.compareSync(userPassword, results.password)) ) {
            loginErrorCode = 1; // no such username
            res.redirect('/login?error=' + loginErrorCode);
        } else {

            req.session.username = req.body.username;
            req.session.cookie.maxAge = 10*60*1000;// 10 minutes
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
        
        res.redirect('/login');
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
    getRightWeather(req, res);
});

app.post('/api/getWeatherByLocation', function (req, res) {
    getRightWeather(req, res);
});

app.get('/api/allWeatherData', function (req, res) {
    var collection = db.collection('weathers');

    if ( typeof req.session.username !== 'undefined') {
      db.collection('users').findOne({ username: req.session.username }, function(err, results) {
        userId = results._id;

        collection.find({ userId: userId }).toArray(function(err, results) {
            if(err)
              throw err;

            weatherResults = {};
            weatherResults['weatherRes'] = results;
            weatherResults['username'] = req.session.username;

            res.json(weatherResults);
        });
      });
    }
});

app.post('/api/recovery', function(req, res) {
  var recoveryErrorCode = 0;
  message.to = req.body.email;
  var code =  Math.floor(Math.random() * (625734874 - 1649357) + 1649357);
  var initialText = message.text;
  message.text = message.text + "\n Your recovery code(s) is/are " + code + "\nIf you have more than one recovery key, use one of them, don't panick.";
  var collectionUser = db.collection('users');
  collectionUser.findOne({email: req.body.email}, function(err, response) {
    if (err) throw err;
    if (response == null) {
      recoveryErrorCode = 2; 
      res.redirect('/recovery?error=' + recoveryErrorCode);// no email
      }
      else {
        server.send(message, function(err, mes) {
            if (err) { 
              throw err;
              recoveryErrorCode = 1; 
              res.redirect('/recovery?error=' + recoveryErrorCode);
            }
            else {
              var collection = db.collection('recovery');
              collection.insert({email: req.body.email, code: code}, function (err, response) {
                if (err) throw err;

               res.redirect('/recovery?error=' + recoveryErrorCode);
               });
          }
        });
    }
  });
 // message.text = initialText;

});


app.post('/api/changePassword', function(req, res) {
  var changePasswordErrorCode = 0;

  var emailCode = parseInt(req.body.emailCode);
  var email = req.body.email;
  var password = bcrypt.hashSync(req.body.password);

  var collection = db.collection('recovery');
 
  collection.findOne({code:emailCode, email:email}, function(err, response) {
    if (err) throw err;

    if(response == null) {
        changePasswordErrorCode = 1;
        res.redirect('/changePassword?error=' + changePasswordErrorCode);// no such thing in database
      }
      else {
        var collectionUser = db.collection('users');
        collectionUser.update({email: email}, {$set: {password: password}}, function(err, response) {
          if (err) throw err;
          else 
            collection.remove({email: email}, function( err, resp) {
              if (err) throw err;
              else
                 res.redirect('/changePassword?error=' + changePasswordErrorCode);// success in removing from recovery and changing password;
            });
            
        });
      }
    
  });
});
/* application */
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

};