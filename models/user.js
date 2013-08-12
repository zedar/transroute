/**
 * Registered user
 */
var mongoose = require("./db").mongoose,
    SALT_WORK_FACTOR = 10,
    bcrypt = require("bcrypt");

// User schemar
var userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  accessToken: {type: String}, // used for remember me
  created: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now}
});

// Encrypt password
userSchema.pre("save", function(next) {
  var user = this;

  if (!user.created) {
    // skip password encryption
    return next();
  }
  
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// Define a new user
var User = mongoose.model("User", userSchema);

module.exports = {
  User: User
}