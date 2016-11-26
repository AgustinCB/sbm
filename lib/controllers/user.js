'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _api_error = require('../error/api_error');

var _api_error2 = _interopRequireDefault(_api_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  current: function current(req, res, next) {
    if (!req.params.id && req.user) return res.status(200).json(req.user);
    if (!req.user && !req.params.id) return res.status(401);
    _user2.default.findOne({ username: req.params.id }).then(function (user) {
      res.status(200).json(user);
    }).catch(function (err) {
      return next(new _api_error2.default('Wrong parameters', 400));
    });
  },
  create: function create(req, res, next) {
    _user2.default.register(req.body).then(function (user) {
      return res.status(200).json(user);
    }).catch(function (err) {
      return next(new _api_error2.default('Wrong parameters', 409));
    });
  },
  update: function update(req, res, next) {
    req.body.hash = undefined;
    req.body.salt = undefined;

    _user2.default.findOneAndUpdate({ username: req.params.id }, req.body).then(function (user) {
      return res.status(200).json(user);
    }).catch(function (err) {
      return next(new _api_error2.default('Wrong parameters', 409));
    });
  },
  delete: function _delete(req, res, next) {
    _user2.default.remove({ username: req.params.id }).then(function () {
      return res.status(204).send();
    }).catch(function (err) {
      return next(new _api_error2.default('Wrong parameters', 400));
    });
  },
  authenticate: _passport2.default.authenticate('local', { session: false }),
  token: function token(req, res) {
    var token = _jsonwebtoken2.default.sign(req.user, 'server secret', { expiresIn: '2h' });
    res.status(200).json({ user: req.user.username, token: token });
  }
};