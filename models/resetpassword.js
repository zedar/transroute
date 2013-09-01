/**
 * Database model for user password reset
 */
var mongoose = require("./db.js").mongoose,
    bcrypt = require("bcrypt"),
    SALT_WORK_FACTOR = 10;

// Password reset schema
var userResetPasswordSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  hashedEmail: {type: String, required: true},
  verificationStatus: Boolean,
  createdAt: {type: Date, default: Date.now, expires: "0.5h"}
});

userResetPasswordSchema.pre("save", function(next) {
  var self = this;
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      next(err);
    }
    bcrypt.hash(self.email, salt, function(err, hash) {
      if (err) {
        next(err);
      }
      self.hashedEmail = hash;
      next();
    })
  })
});

var ResetPassword = mongoose.model("ResetPassword", userResetPasswordSchema);

module.exports = {
  ResetPassword: ResetPassword
}