/**
 * Different configuration settings
 */
var nodemailer = require("nodemailer");

var authEmail ="eurotransroute@gmail.com",
    authPwd = "transroute!@#zedar";
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: authEmail,
        pass: authPwd
    }
});

// configure reference to mongodb depending if it is local installation or AppFrog
if (process.env.VCAP_SERVICES) {
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env["mongodb-1.8"][0]["credentials"];
}
else {
  var mongo = {
    "hostname": "localhost",
    "port": 27017,
    "username": "",
    "password": "",
    "name": "",
    "db": "transroute"
  }
}

function generateMongoUrl(mongo) {
  mongo.hostname = (mongo.hostname || "localhost");
  mongo.port = (mongo.port || 27017);
  mongo.db = (mongo.db || "transroute");

  if (mongo.username && mongo.password) {
    return "mongodb://" + mongo.username + ":" + mongo.password + "@" + mongo.hostname + ":" + mongo.port + "/" + mongo.db; 
  }
  else {
    return "mongodb://" + mongo.hostname + ":" + mongo.port + "/" + mongo.db; 
  }
}

var mongodburl = generateMongoUrl(mongo);
console.log("DATABASE URL: ", mongodburl);

module.exports = {
  db: {
    development: mongodburl,
    test: mongodburl,
    production: mongodburl
  },
  mailer: {
    email: authEmail
  },
  smtpTransport: smtpTransport
}