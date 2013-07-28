
/**
 * Module dependencies.
 */

var express = require("express")
  , routes = require("./routes")
  , user = require("./routes/user")
  , http = require("http")
  , path = require("path")
  , i18n = require("i18next")
  , passport = require("passport")
  , auth = require("./auth")
  , flash = require("connect-flash")
  , MemoryStore = require("connect").session.MemoryStore;

// initialization of i18n localisation
i18n.init({
  lng: "pl",
  saveMissing: true,
  debug: false,
  ignoreRoutes: ["images/", "public/", "css/", "js/"]
});

var app = express();
// session store support
app.sessionSecret = "tr1nsr0t3";
app.sessionStore = new MemoryStore();

// socket.io support
var server = http.createServer(app);
var io = require("socket.io").listen(server);

// all environments
//app.set("port", process.env.PORT || 3000);
app.set("port", process.env.VMC_APP_PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use("/", express.static(path.join(__dirname, "public"))); // static resources has to be before session
app.use("/dojo", express.static(path.join(__dirname, "vendor/dojo")));
app.use("/dojo-release", express.static(path.join(__dirname, "vendor/dojo-release")));
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.compress());  // add gzip for express requests
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: app.sessionSecret, key: "express.sid", store: app.sessionStore}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(i18n.handle);
app.use(flash());
app.use(app.router);


// i18n add-on fo express.js

i18n.registerAppHelper(app);

// development only
if ("development" == app.get("env")) {
  console.log("In development mode");
  app.use(express.errorHandler());
}

// define routes
require("./routes")(app);
// define socket.io routes
require("./ioroutes")(app, io);

// commented out because socket.io required faster creation of server.
// http.createServer(app).listen(app.get("port"), function(){
//   console.log("Express server listening on port " + app.get("port"));
// });
// listen with socket.io
server.listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
});
