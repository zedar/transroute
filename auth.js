/**
 * Configure passport.js authentication
 */
var passport = require("passport"), 
    LocalStrategy = require("passport-local").Strategy;

// testing data for user authentication
var users = [
  {id: 1, username: "robert", password: "test", email: "zakrzewski.robert@gmail.com"},
  {id: 2, username: "krzychu", password: "test", email: "krzychu@neostrada.pl"}
];

function findByUserId(id, fn) {
  for (var i=0, count=users.length; i<count; i++) {
    if (users[i].id === id) {
      return fn(null, users[i]);
    }
  }
  return fn(new Error("user " + id + " does not exist"));
}

function findByUsername(username, fn) {
  for (var i=0, count=users.length; i<count; i++) {
    if (users[i].username === username) {
      return fn(null, users[i]);
    }
  }
  return fn(null, null);
}

// passport session setup
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findByUserId(id, function(err, user) {
    done(err, user);
  });
});

// define local strategy for passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    // async verification
    process.nextTick(function() {
      findByUsername(username, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: "unknown user " + username});
        }
        if (user.password !== password) {
          return done(null, false, {message: "invalid password"});
        }
        return done(null, user);
      });
    });
  }
));

module.exports = {

};