require('../models/users');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport')

const User = mongoose.model('User');

const sendJSONResponse = (res, stat, content) => {
    res
      .status(stat)
      .json(content);
};

//encrypt password
const register = (req, res, next) => { 
    bcrypt.hash(req.body.password, 10, (err, hashedPass)=>{
        if(err) {
            sendJSONResponse(res, 400, {message: "error enctrypting"});
        }
        User.create({
            username: req.body.username,
            alias: req.body.alias,
            email: req.body.email,
            password: hashedPass,
        }, (err, user )=>{
            if(err) {
                sendJSONResponse(res, 400, {message: "error creating user"});
            } else {
                sendJSONResponse(res, 201,user);
            }
        });
    });
};

const logInUser = (req, res, next) => {
    console.log('loggin in...');
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/sign',
        failureFlash: true
    })(req, res, next);
};

module.exports = {
    register,
    logInUser
};

