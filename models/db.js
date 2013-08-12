/**
 * Define reference to mongodb. If connection to the server fail
 */
var config = require("./config.js"),
    mongoose = require("mongoose"),
    env = process.env.NODE_ENV || "development",
    dbUrl = config.db[env];

mongoose.connect(dbUrl, {server: {auto_reconnect: true}});

var db = mongoose.connection,
    reconnectTimer = null;

function reconnect() {
  reconnectTimer = null;
  console.log("Database connection: try to connect: %d", mongoose.connection.readyState);
  db = mongoose.connect(dbUrl, {server: {auto_reconnect: true}});
}

db.on("error", function() {
  console.error.bind(console, "Database connection error");

  if (reconnectTimer) {
    console.log("Already trying to reconnect");
  }
  else {
    reconnectTimer = setTimeout(reconnect, 5000);
  }
});

db.once("open", function() {
  console.log("Connected to the database");
});

process.on("SIGINT", process.exit.bind(process));

module.exports = {
  mongoose: mongoose
}