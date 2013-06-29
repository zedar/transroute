// profile for dojo build system
var profile = (function() {
  "use strict";
  return {
    // path to source code
    basePath: "../../vendor/dojo",
    // directory where builded and minified files go, related to basePath
    releaseDir: "..",
    // the name of release that is attached as subfolder of releaseDir
    releaseName: "dojo-release",
    // action, for now only release is allowed
    action: "release",
    // packages used by build system when mapping modules
    packages: [
      {name: "dojo", location: "dojo"},
      {name: "dijit", location: "dijit"},
      {name: "bootstrap", location: "dojo-bootstrap"}
    ],
    // layers of modules
    layers: {
      "dojo-release/bootstrap-release": {
        include: [
          "bootstrap/Dropdown",
          "bootstrap/Collapse",
          "dojo/parser",
          "dojo/_base/url",
          "dojo/date/stamp"
        ]
      }
    },
    // Uses ShrinkSafe as the JavaScript minifier. This can also be set to "closure" to use Closure Compiler.
    optimize: "shrinksafe",
    // Strips all comments from CSS files.
    cssOptimize: "comments",
    // Excludes tests, demos, and original template files from being included in the built version.
    mini: true,
    // Strips all calls to console functions within the code.
    stripConsole: "all",
    // The default selector engine is not included by default in a dojo.js build in order to make mobile builds
    // smaller. We add it back here to avoid that extra HTTP request.
    selectorEngine: "acme"
  };
})();