/**
 * Define context for routes
 */
var start = require("./routes/start.js"),
    transroute = require("./routes/transroute.js"),
    messages = require("./routes/messages.js"),
    passport = require("passport");

// middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
    res.send({redirect: "/login"});
    return;
  }
  res.redirect("/login");
}

module.exports = function(app) {
  app.get("/", start.index);

  app.get("/login", start.login);

  app.post("/login", passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/login",
    failureFlash: "login.error.failure"
  }));

  app.get("/logout", start.logout);

  app.get("/welcome", ensureAuthenticated, transroute.welcome);

  app.post("/message", ensureAuthenticated, messages.message);
}