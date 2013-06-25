/**
 * Define context for routes
 */
var start = require("./routes/start.js"),
    transroute = require("./routes/transroute.js"),
    passport = require("passport");

// middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = function(app) {
  app.get("/", start.index);

  app.get("/login", start.login);

  app.post("/login", passport.authenticate("local", {
    successRedirect: "/transroute",
    failureRedirect: "/login",
    failureFlash: "login.error.failure"
  }));

  app.get("/logout", start.logout);

  app.get("/transroute", ensureAuthenticated, transroute.welcome);
}