'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passportLocalMongoose = require('passport-local-mongoose');

var _passportLocalMongoose2 = _interopRequireDefault(_passportLocalMongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = new _mongoose2.default.Schema({
  username: { type: String, unique: true },
  name: String,
  description: String,
  email: String,
  admin: Boolean
});

User.plugin(_passportLocalMongoose2.default);

User.statics.passportRegister = User.statics.register;
User.statics.register = function (user) {
  return new Promise(function (resolve, reject) {
    var password = user.password;
    user.password = undefined;

    User.statics.passportRegister.bind(UserModel)(new UserModel(user), password, function (err, user) {
      if (err) return reject(err);
      resolve(user);
    });
  });
};
var UserModel = _mongoose2.default.model('User', User);
exports.default = UserModel;