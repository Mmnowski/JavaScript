var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  password: {
    type: String
  },
  email: {
    type: String,
    unique: true    
  },
  name: {
    type: String
  },
  surname: {
    type: String
  },
});

UserSchema.pre('save', function(next) {
  var user = this
  bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

var User = module.exports = mongoose.model('User', UserSchema);


module.exports.getByUsername = (username, callback) => {
  var query = {username: username};
  User.findOne(query, callback);
};
module.exports.getById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.comparePassword = (candidate, hash, callback) => {
  bcrypt.compare(candidate, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null,isMatch);
  });
};