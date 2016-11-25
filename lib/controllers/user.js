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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  current: function current(req, res) {
    res.status(200).json(req.user);
  },
  create: function create(req, res) {
    _user2.default.register(req.body).then(function (user) {
      return res.status(200).json(user);
    }).catch(function (err) {
      return res.status(400);
    });
  },
  update: function update(req, res) {
    return res.status(200).json({});
  },
  delete: function _delete(req, res) {
    return res.status(200).json({});
  },
  authenticate: _passport2.default.authenticate('local', { session: false }),
  token: function token(req, res) {
    var token = _jsonwebtoken2.default.sign(req.user, 'server secret', { expiresIn: "2h" });
    res.status(200).json({ user: req.user.username, token: token });
  }
};