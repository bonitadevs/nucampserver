const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate())); //requires a verified callback function, that will verify the username and password against the locally store values
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) { //contain id for user doc, and will return a token created by jwt.sign
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

const opts = {}; //contains options for jwt strategy
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();  //specifies how JWT should be iniitialized and received, and the server expects token to be sent in an Auth Header as a bearer token
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});