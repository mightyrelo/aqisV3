const request = require('request');
const passport = require('passport');

const apiOptions = {
    server: 'http://localhost:3000'
};
if(process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://aqisv3.herokuapp.com';
}

const renderRegisterPage = (req, res) => {
    res.render('register', {
        title: 'Register on AQIS',
        pageHeader : {
            title: 'Registration',
            strapline: 'Register to use AQIS'
        }
    });
};

const showRegPage = (req, res) => {
    renderRegisterPage(req, res);
};


const showError = (req, res, sc) => {
    let title = '';
    let content = '';
    if(sc === 404) {
        title = '404, page not found';
        content = 'Oh dear, looks like you can\'t get this page, sorry.';
    } else {
        title = `${sc}, something has gone wrong`;
        content = 'something, somewhere has gone wrong';
    }
    res.status(sc);
    res.render('generic-text', {
        title,
        content
    });
};

const registerUser = (req, res) => {
    const path = '/api/users';
    const postData = {
        username: req.body.username,
        alias: req.body.alias,
        email: req.body.email,
        password: req.body.password,
    }
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    request(requestOptions, (err, {statusCode}, user)=>{
        if(statusCode === 201) {
            res.redirect('/');
        } else {
            showError(req, res, statusCode);
        }
    });
};

const renderSignInPage = (req, res) => {
    res.render('log-in', {
        title: 'Log into AQIS',
        pageHeader : {
            title: 'Sign In',
            strapline: 'Fill out form to sign in'
        }
    }); 
};

const showLogInPage = (req, res) => {
    renderSignInPage(req, res);
};



const logInUser = (req, res) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/sign/?err=true'
      });
};

const logout = (req, res, next) => {
        req.logout((err)=>{
            if(err) {return next(err);}
            res.redirect('/');
        });
};

module.exports = {
    showRegPage,
    registerUser,
    showLogInPage,
    logInUser,
    logout
};

