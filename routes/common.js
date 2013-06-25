/**
 * Common function for all routes
 */
module.exports = {
  // get current language
  getCurrentLng: function (req) {
    if (!req) {
      return "pl";
    }
    var i18n = req.i18n;
    if (i18n) {
      var lng = i18n.lng();
      console.log("==== Locale i18n lang: ", i18n.lng());
      if (lng === "dev") {
        lng = "pl";
      }
      else {
        if (lng.length > 2) {
          if (lng.indexOf("pl") == 0) {
            lng = "pl";
          }
          else if (lng.indexOf("en") == 0) {
            lng = "en";
          }
          else if (lng.indexOf("de") == 0) {
            lng = "de";
          }
        }
      }
    }
    else {
      console.log("==== Locale i18n NOT DEFINED: ");
    }
    return {
      lng: lng,
      i18n: i18n
    };
  }
}