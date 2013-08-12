/**
 * Database model for user activation process
 */
var mongoose = require("./db.js").mongoose,
    bcrypt = require("bcrypt"),
    SALT_WORK_FACTOR = 10;

// User activation schema
var userActivationSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  hashedEmail: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  verificationStatus: Boolean,
  createdAt: {type: Date, default: Date.now, expires: "0.5h"}
});

userActivationSchema.pre("save", function(next) {
  var self = this;
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(self.email, salt, function(err, hash) {
      if (err) return next(err);
      console.log("EMAIL HASH: ", hash, " SALT: ", salt);
      self.hashedEmail = hash;

      // hash for password
      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(self.password, salt, function(err, hash) {
          if (err) return next(err);
          console.log("PWD HASH: ", hash, " SALT: ", salt);
          self.password = hash;
          next();
        })
      })
    })
  });
});

// Activation schema
var UserActivation = mongoose.model("UserActivation", userActivationSchema);

module.exports = {
  UserActivation: UserActivation
}