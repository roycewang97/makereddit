const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

/* 
  Before saving request to db, we the schema we created as this
  the api call from bcrypt hashes the info from http request
  We are assigned a hash from bycrpt api output-->input how many times we want to scrambled -->(10x)
  we set our password as that hash
  we then tell the action to continue with next()
*/
UserSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

/*
  Authentication
*/

UserSchema.statics.authenticate = function (username, password, next) {
  //find a user with the username as entered-->req
  //what you get back is mongo object of user with that username in that collection
  User.findOne({username: username})
    .exec(function (err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        var err = new Error("No User Found!");
        err.status = 401;
        return next(err);
      }
      //if there are no errors, get password from request and user compare method with req.user.password
      //next() is to ensure that the request-response cycle ends between server and db for the next action to be called
      //next helps to manages logic/controller flow
      bcrypt.compare(password, user.password, function(err, matchResponse){
        if (matchResponse) {
          return next(null, user);
        } else {
          return next();
        }
      });
  });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;