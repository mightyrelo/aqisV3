var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var apiRouter = require('./app_api/routes/index');
var indexRouter = require('./app_server/routes/index');
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
require('./app_api/models/users')
const passport = require('passport');
require('./app_api/models/db');
require('./app_api/models/users');

require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "verygoodsecret",
  resave: false,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

const User = mongoose.model('User');
passport.serializeUser((user, done)=>{
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done)=>{
    //set up user model
    User.findById(id, (err, user)=> {
        done(err, user);
    });
  });
  
  passport.use(new localStrategy((username, password, done)=>{
    User.findOne({username: username}, (err, user)=>{
        if(err) {return done(err)}
        if(!user) {
            return done(null, false, {message: "no user found"});
        }
        bcrypt.compare(password, user.password, (err, res)=>{
            if(err) {return done(err);}
            if(res === false) {
                return done(null, false,{message: "incorrect password"});
            }
            return done(null, user);
        });
    });
  })); 

app.post('/sign',  passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sign/?err=true'
}));

app.use('/', indexRouter);
app.use('/api', apiRouter);


//require('./app_api/config/passport');

/////



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
