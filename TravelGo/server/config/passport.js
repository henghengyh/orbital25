// To be created
const JwtStrategy = require('passport-jwt').Strategy;

// What is passport-jwt?
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./keys');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

// Declaring a lambda function named module.exports
// @param {object} passport - The passport object used for authentication
// @returns {done()} - This function does not returns the authentication outcome
// This function is used to extract the JWT from the request
// and verify it using the secret key.
module.exports = passport => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => done(err));   // Chose to not console.log(err));
    })
  );
};