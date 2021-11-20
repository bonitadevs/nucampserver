const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate())); //requires a verified callback function, that will verify the username and password against the locally store values
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());
