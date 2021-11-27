const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');



const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
}); 

/* POST allow new users sign-up for system. */

router.post('/signup', (req, res) => {
  User.register(//callbacks to register a new user
      new User({username: req.body.username}), //username suggested from client
      req.body.password, //password suggested from client
      err => {
          if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
          } else {
              passport.authenticate('local')(req, res, () => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({success: true, status: 'Registration Successful!'});
              });
          }
      }
  );
});

//create the token 
router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id}); //issue token to the user, pass in object that contains a payload
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
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
