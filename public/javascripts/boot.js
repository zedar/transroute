require(["app/app-release"], function() {
  require([
    "dojo/parser",
    "app/App",
    "dojo/domReady!"
  ], function(parser, App) {
    parser.parse();
    var app = new App();
    app.startup(action, "content");
  });
});