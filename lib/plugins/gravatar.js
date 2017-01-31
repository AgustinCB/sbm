"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app, mongoose, authenticate, login) {
  prepareModel(mongoose);
};

var prepareModel = function prepareModel(mongoose) {
  var User = mongoose.models.User;

  var UserSchema = User.schema;

  UserSchema.add({
    gravatar: String
  });
};