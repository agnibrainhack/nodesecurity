var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./database_sync/operations');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));


//app.use(cookieParser('12345-67890-09876-54321'));
app.use(passport.initialize());
app.use(passport.session());


app.use('/users', users);

function auth (req, res, next) {
  //console.log(req.user);

  if (!req.user) {
    
    var err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');                          
    err.status = 401;
    next(err);
  }
  else {
        next();
  }
}
app.use(auth);//authorization

app.use('/api', index);

app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./routes/models/genericModels');

const url2 = 'mongodb://localhost:27017/FastServer';
const connect = mongoose.connect(url2, {
   // useMongoClient: true
});

connect.then((db) => {

    console.log('Connected correctly to server');
}, (err) => {  console.log(err);   });



module.exports = app;
