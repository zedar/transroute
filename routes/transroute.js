/**
 * TRANSPORTATION ROUTES (SPEDITION) MANAGEMENT
 */
var common = require("./common.js");

module.exports = {
  welcome: function(req, res) {
    // get current server path
    var url = req.protocol + "://" + req.headers.host + req.url;
    var lng = common.getCurrentLng(req);
    res.render("welcome", {
      title: "EuroSpedytor",
      lng: lng.i18n.t("menu.lang." + lng.lng),
      usr: req.user ? req.user.username : null,
      url: url
    });
  }
}