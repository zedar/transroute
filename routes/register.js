/**
 * New user REGISTRATION
 */
var common = require("./common.js"),
    _ = require("underscore")._,
    config = require("../models/config.js"),
    smtpTransport = config.smtpTransport,
    UserActivation = require("../models/activation.js").UserActivation,
    User = require("../models/user.js").User,
    ResetPassword = require("../models/resetpassword.js").ResetPassword;

module.exports = {
  ensureNotSpam: function(req, res, next) {
    // Summary:
    //  Middleware to stop user from registering the second time
    // query is reference to list of query parameters
    var token = req.query["token"];
    if (token == undefined) {
      res.render("register");
    }
    else {
      return next();
    }
  },

  checkActivationStatus: function(req, res, next) {
    // Summary:
    //  Middleware to use by routes. Check if user activation started and email has been sent to the user.
    //  User activation data expires in some time (default 0.5h)
    var data = req.body;
    if (!data.username || !data.email) {
      return next();
    }
    var lng = common.getCurrentLng(req);
    UserActivation.findOne({$or: [{username: data.username}, {email: data.email}]}, function(err, ua) {
      if (err) {
        return next(err);
      }
      else if (ua === null) {
        return next();
      }
      else if (ua.verificationStatus === true) {
        return res.json(200, {message: lng.i18n.t("register.message.activated")});
      }
      else {
        return res.json(200, {message: lng.i18n.t("register.message.inprogress")});
      }
    });
  },

  checkUserRegistered: function(req, res, next) {
    // Summary:
    //  Middleware to use by routes. Check if user already registered
    // Check if username and email is free
    var data = req.body;
    if (!data.username || !data.email) {
      return next();
    }
    var lng = common.getCurrentLng(req);
    User.findOne({$or: [{username: data.username}, {email: data.email}]}, function(err, user) {
      if (err) {
        return next(err);
      }
      if (user === null) {
        return next();
      }
      else {
        console.error(__filename + ": Username or email already in use");
        return res.json(401, {error: lng.i18n.t("register.error.alreadyregistered")});
      }
      
    });
  },

	show: function(req, res) {
		// Summary:
		// 	Called by GET method. 
    var lng = common.getCurrentLng(req);  
    res.render("register", {
      title: "EuroSpedytor", 
      lng: lng.lng,
      lngTitle: lng.i18n.t("menu.lang." + lng.lng),
      usr: req.user ? req.user.username : null,
      action: "REGISTER"
    });  
	},

  register: function(req, res) {
    // Summary:
    //  Check if username or email registration is in progress. If not create temp record and send email confirmation email to customer
    var lng = common.getCurrentLng(req);
    var data = req.body;
    var missingAttrs = [];
    if (!_.has(data, "username")) {
      missingAttrs.push(lng.i18n.t("register.error.username"));
    }
    if (!_.has(data, "email")) {
      missingAttrs.push(lng.i18n.t("register.error.email")); 
    }
    if (!_.has(data, "password")) {
      missingAttrs.push(lng.i18n.t("register.error.password")); 
    }
    if (!_.has(data, "confirmPassword")) {
      missingAttrs.push(lng.i18n.t("register.error.confirmPassword")); 
    }

    if (missingAttrs.length > 0) {
      var error = lng.i18n.t("register.error.missingattributes") + ": [" + missingAttrs.join(", ") + "]";
      console.error(__filename + ": " + error);
      return res.json(401, {error: error});
    }

    // Check if activation process for the given username is in progress
    var userActivation = new UserActivation({
      username: data.username,
      email: data.email,
      hashedEmail: data.email,
      password: data.password,
      verificationStatus: false
    });
    userActivation.save(function(err, data) {
      if (err) {
        console.log(__filename + ": " + err);
        return res.json(400, {message: lng.i18n.t("register.error.save")});
      }
      // get current server path
      var url = req.protocol + "://" + req.headers.host /*+ req.url*/;

      var mailOptions = {
        from: 'EuroSpedytor ✔ ' + config.mailer.email, // sender address
        to: data.email, // list of receivers
        subject: lng.i18n.t("register.message.signupconfirmation") + " ✔", // Subject line
        text: lng.i18n.t("register.message.signupconfirmation") + " ✔", // plaintext body
        html: "<b>" + lng.i18n.t("register.message.signupconfirmation") + " ✔</b><br />"
            + lng.i18n.t("register.message.signupemail") + data.email + "<br />"
            + "<a href=\""+ url + "/confirm?token=" + data.hashedEmail + "\">" + lng.i18n.t("register.message.signupclick") + "</a>"
      };
      smtpTransport.sendMail(mailOptions);

      return res.json(200, {message: lng.i18n.t("register.message.success")});
    });
  },

  confirm: function(req, res) {
    // Summary:
    //  Confirm user activation. Token has to be given
    var data = req.query;
    var token = data["token"];
    var lng = common.getCurrentLng(req);

    UserActivation.findOne({hashedEmail: token}, function(err, ua) {
      if (err) {
        return next(err);
      }
      else if (!ua) {
        console.error(__filename + ": Missing token"); 
        res.render("error", {error: lng.i18n.t("register.error.missingtoken")});
        return;
      }
      else {
        if (data.verificationStatus === true) {
          res.render("error", {error: lng.i18n.t("register.error.alreadyactivated")});
          return;
        }
        else {
          var user = new User({
            username: ua.username,
            email: ua.email,
            password: ua.password
          });
          User.findOne({username: user.username}, function(err, data) {
            if (err) {
              return next(err);
            }
            else if (data) {
              console.error(__filename + ": Non unique user name");
              res.render("error", {error: lng.i18n.t("register.error.nonuniqueuser")});
              return;
            }
            else {
              user.save(function(err) {
                if (err) {
                  console.log(__filename + ": " + err);
                  res.render("error", {error: lng.i18n.t("register.error.save")});
                  return;
                }
                else {
                  UserActivation.update({username: user.username, email: user.email}, {verificationStatus: true}, function(err) {
                    if (err) {
                      return next(err);
                    }
                    else {
                      res.redirect("/login");
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  },

  resetPassword: function(req, res, next) {
    // Summary:
    //  Reset password. Email has to be given as post body parameter
    // Method: POST
    var lng = common.getCurrentLng(req);
    var data = req.body;
    if (!_.has(data, "email")) {
      return res.json(400, {error: lng.i18n.t("resetpassword.error.missingemail")});
    }
    // Check if user with the given email is already registered
    User.findOne({email: data.email}, function(err, user) {
      if (err) {
        console.error(__filename, ": resetPassword: ", err);
        return res.json(400, {error: lng.i18n.t("resetpassword.error.exception")});
      }
      if (!user) {
        console.error(__filename, ": resetPassword: USER NOT FOUND");
        return res.json(400, {error: lng.i18n.t("resetpassword.error.exception")});
      }
      // Create new pending password reset
      var resetPassword = new ResetPassword({
        username: user.username,
        email: user.email,
        hashedEmail: user.email,
        verificationStatus: false
      });
      resetPassword.save(function(err, data) {
        if (err) {
          console.error(__filename, ": ", err);
          return res.json(400, {error: lng.i18n.t("resetpassword.error.exception")});
        }
        // Send email with instructions about how to reset password
        // get current server path
        var url = req.protocol + "://" + req.headers.host /*+ req.url*/;

        var mailOptions = {
          from: 'EuroSpedytor ✔ ' + config.mailer.email, // sender address
          to: data.email, // list of receivers
          subject: lng.i18n.t("resetpassword.message.subject") + " ✔", // Subject line
          text: lng.i18n.t("resetpassword.message.text") + " ✔", // plaintext body
          html: "<b>" + lng.i18n.t("resetpassword.message.text") + " ✔</b><br />"
              + lng.i18n.t("resetpassword.message.username") + data.username + "<br />"
              + lng.i18n.t("resetpassword.message.email") + data.email + "<br />"
              + "<a href=\""+ url + "/confirmresetpassword?token=" + data.hashedEmail + "\">" + lng.i18n.t("resetpassword.message.click") + "</a>"
        };
        smtpTransport.sendMail(mailOptions);  

        return res.json(200, {message: lng.i18n.t("resetpassword.message.success")});
      });
    });
  },

  confirmResetPassword: function(req, res, next) {
    // Summary:
    //  Check iff request contains required token, if token is in ResetPassword collection, if token is not yet verified.
    //  Then display ChangePassword page
    // Method: GET
    var data = req.query;
    var token = data["token"];
    var lng = common.getCurrentLng(req);

    ResetPassword.findOne({hashedEmail: token}, function(err, data) {
      if (err) {
        console.error(__filename, ": err: ", err);
        res.render("error", {error: lng.i18n.t("resetpassword.error.exception")});
        return;
      }
      if (!data) {
        res.render("error", {error: lng.i18n.t("resetpassword.error.missingtoken")});
        return;
      }
      if (data.verificationStatus === true) {
        res.render("error", {error: lng.i18n.t("resetpassword.error.exception")});
        return;
      }
      ResetPassword.update({email: data.email}, {verificationStatus: true}, function(err) {
        if (err) {
          console.error(__filename, ": err: ", err);
          res.render("error", {error: lng.i18n.t("resetpassword.error.exception")});
          return;
        }
        // check if current request is authenticated. If yes logout
        if (req.isAuthenticated()) {
          req.logout();
        }
        res.render("changepassword", {
          title: "EuroSpedytor", 
          lng: lng.lng,
          lngTitle: lng.i18n.t("menu.lang." + lng.lng), 
          usr: req.user ? req.user.username : null,
          token: data.hashedEmail,
          action: "!changepassword"});
      });
    });  
  },

  changePassword: function(req, res, next) {
    // Summary:
    //  Ensure that request contains token. Ensure that the record in PasswordReset is validated.
    //  Then change password.
    // Method: POST
    var lng = common.getCurrentLng(req);
    var data = req.body;
    if (!_.has(data, "token")) {
      return res.json(400, {error: lng.i18n.t("resetpassword.error.exception")});
    }
    if (!_.has(data, "password") || !_.has(data, "confirmPassword")) {
      return res.json(400, {error: lng.i18n.t("resetpassword.error.missingattributes")});
    }
    ResetPassword.findOne({hashedEmail: data.token}, function(err, tokenData) {
      if (err) {
        console.error(__filename, ": ", err);
        return res.json(400, {error: lng.i18n.t("resetpassword.error.exception")});
      }
      if (!tokenData) {
        console.error(__filename, ": hashedEmail not found in ResetPassword pending record");
        return res.json(400, {error: lng.i18n.t("resetpassword.error.exception")});
      }
      // check if update or save is required in this case
      User.findOne({email: tokenData.email}, function(err, user) {
        if (err) {
          console.error(__filename, ": ", err);
          return res.json(400, {error: lng.i18n.t("resetpassword.error.exception")});
        }
        if (!user) {
          console.error(__filename, ": USER NOT FOUND");
          return res.json(400, {error: lng.i18n.t("resetpassword.error.exception")});
        }
        user.password = data.password;
        user.save(function(err) {
          if (err) {
            console.error(__filename, ": ", err);
            return res.json(400, {error: lng.i18n.t("resetpassword.error.exception")});
          }
          return res.json(200);
        });
      });
    });
  }
};