/**
 * TRANSPORTATION ROUTES (SPEDITION) MANAGEMENT
 */
var common = require("./common.js");

module.exports = {
  welcome: function(req, res) {
    var lng = common.getCurrentLng(req);
    res.render("welcome", {
      title: "EuroSpedytor",
      lng: lng.i18n.t("menu.lang." + lng.lng),
      usr: req.user ? req.user.username : null});
  }
}