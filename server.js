//creates an express application
var express = require('express');
//the app object conventionally denotes the Express application
var app = express();

//import required modules
//use require directive to load Node.js module
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

app.set('port', process.env.PORT || 7380);
app.use(logger('dev'));
app.use(session({
	secret: 'hahaboomboom',
	saveUninitialized: false,
	resave: true

}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app);

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});