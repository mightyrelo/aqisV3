const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

module.exports = function(passport) {
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
}

  