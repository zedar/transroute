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

module.exports = {
  db: {
    development: "mongodb://localhost/transroute",
    test: "mongodb://localhost/transroute-test"
  },
  mailer: {
    email: authEmail
  },
  smtpTransport: smtpTransport
}