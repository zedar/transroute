
/**
 * Module dependencies.
 */

var express = require("express")
  , fs = require("fs")
  , routes = require("./routes")
  , user = require("./routes/user")
  , http = require("http")
  , https = require("https")
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

if ("development" === app.get("env")) {
  var server = http.createServer(app);
  app.set("port", process.env.PORT || 3000);
}
// in production mode server should be under https
else if ("production" === app.get("env")) {
  console.log("In production mode");
  var httpapp = express();
  var options = {
    key: fs.readFileSync("./cert/privatekey.pem"),
    cert: fs.readFileSync("./cert/certificate.pem")
  };
  var httpserver = http.createServer(httpapp);
  var server = https.createServer(options, app); 
  app.set("httpport", process.env.HTTPPORT || 3000);
  app.set("port", process.env.PORT || 3443);
}
// socket.io support

var io = require("socket.io").listen(server);

// all environments
//app.set("port", process.env.PORT || 3000);
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

if ("development" === app.get("env")) {
  server.listen(app.get("port"), function(){
    console.log("Express server listening on port " + app.get("port"));
  });
}
else if ("production" == app.get("env")) {
  httpserver.listen(app.get("httpport"), function(){
    console.log("Express HTTP server listening on port " + app.get("httpport"));
  });
  server.listen(app.get("port"), function(){
    console.log("Express HTTPS server listening on port " + app.get("port"));
  });
  // Forward all HTTP requests to HTTPS
  httpapp.get("*", function(req, res) {
    // strip out port number
    var hostname = (req.headers.host.match(/:/g)) ? req.headers.host.slice(0, req.headers.host.indexOf(":")) : req.headers.host;
    console.log("HTTP REQ HOST: ", hostname);
    var url = "https://" + hostname + ":" + app.get("port") + req.url;
    res.redirect(url);
  });
}

