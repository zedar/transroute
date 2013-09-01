/*
 * GET home page actions.
 */
var common = require("./common.js"),
    _ = require("underscore"),
    passport = require("passport");

module.exports = {
  index: function(req, res) {
    var lng = common.getCurrentLng(req);
    res.render("index", {
      title: "EuroSpedytor", 
      lng: lng.lng,
      lngTitle: lng.i18n.t("menu.lang." + lng.lng),
      usr: req.user ? req.user.username : null});
  },

  login: function(req, res) {
    // GET
    var lng = common.getCurrentLng(req);
    var msg = req.flash("error");
    if (msg && msg.length > 0) {
      msg = req.i18n.t(msg[0]);
    }
    else {
      msg = ""
    }
    console.log("LOGIN: error message: ", msg);
    
    res.render("login", {
      title: "EuroSpedytor", 
      lng: lng.lng,
      lngTitle: lng.i18n.t("menu.lang." + lng.lng), 
      usr: req.user ? req.user.username : null,
      action: "LOGIN",
      errorMessage: msg });
  },

  authenticate: function(req, res, next) {
    // Method: POST
    var lng = common.getCurrentLng(req);
    passport.authenticate("local", function(err, user, info) {
      console.log("Authenticate result: ", err, user, info);
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json(401, {error: lng.i18n.t("login.error.failure")});
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.json(200, {redirect: "/welcome"});
      });
    })(req, res, next);
  },

  logout: function(req, res) {
    req.logout();
    var lng = common.getCurrentLng(req);
    res.redirect("/");
  },
};
