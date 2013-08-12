/**
 * Configure passport.js authentication
 */
var passport = require("passport"), 
    LocalStrategy = require("passport-local").Strategy,
    User = require("./models/user.js").User;

function findByUserId(id, fn) {
  User.findOne({_id: id}, function(err, user) {
    return fn(err, user);
  });
  //return fn(new Error("user " + id + " does not exist"));
}

function findByUsername(username, fn) {
  User.findOne({username: username}, function(err, user) {
    fn(err, user);
  });
}

// passport session setup
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findByUserId(id, done);
});

// define local strategy for passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    // async verification
    process.nextTick(function() {
      User.findOne({username: username}, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: "unknown user " + username});
        }
        user.comparePassword(password, function(err, isMatch) {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          }
          else {
            return done(null, false, {message: "invalid password"});
          }
        });
      })
    });
  }
));

module.exports = {
  findByUserId: findByUserId
};