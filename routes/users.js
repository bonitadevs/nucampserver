const express = require('express');
const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
}); 

/* POST allow new users sign-up for system. */

router.post('/signup', (req, res, next) => { 
    User.findOne({username: req.body.username}) //static method to find if another username exists
    .then(user => {
        if (user) {
            const err = new Error(`User ${req.body.username} already exists!`);
            err.status = 403;
            return next(err);
        } else {
            User.create({
                username: req.body.username,
                password: req.body.password})
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});
            })
            .catch(err => next(err));//for catching any errors
        }
    })
    .catch(err => next(err)); //if .findOne() turns a rejected promise, an error with .findOne()
});


/* POST for users to be able to login. */
router.post('/login', (req, res, next) => {
    if(!req.session.user) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
      
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];
      
        User.findOne({username: username})
        .then(user => {
            if (!user) {//check for existing usernames
                const err = new Error(`User ${username} does not exist!`);
                err.status = 401;
                return next(err);
            } else if (user.password !== password) { //check if correct password
                const err = new Error('Your password is incorrect!');
                err.status = 401;
                return next(err);
            } else if (user.username === username && user.password === password) { //user successfully authenticated
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }
        })
        .catch(err => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
});

router.get('/logout', (req, res, next) => { //logout to clear a cookie
      if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        const err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    }
});

module.exports = router;
