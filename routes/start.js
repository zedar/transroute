/*
 * GET home page actions.
 */
var common = require("./common.js");

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
      errorMessage: msg });
  },

  logout: function(req, res) {
    req.logout();
    var lng = common.getCurrentLng(req);
    res.redirect("/");
  },

};
