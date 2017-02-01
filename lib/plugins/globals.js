'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app, mongoose, authenticate, login) {
  prepareModel(mongoose);
  prepareApp(app, mongoose, authenticate, login);
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api_error = require('../error/api_error');

var _api_error2 = _interopRequireDefault(_api_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prepareModel = function prepareModel(mongoose) {
  var Globals = new mongoose.Schema({
    name: String,
    value: String
  });

  mongoose.model('Globals', Globals);
};

var prepareApp = function prepareApp(app, mongoose, authenticate, login) {
  var router = _express2.default.Router();
  var Globals = mongoose.models.Globals;


  router.get('/', function (req, res, next) {
    return Globals.find({}).then(function (result) {
      return res.status(200).json(result);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  });

  router.get('/:global', function (req, res, next) {
    return Globals.findOne({ name: req.params.global }).then(function (result) {
      return res.status(200).json(result);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  });

  router.post('/', authenticate, login, function (req, res, next) {
    var global = new Globals({
      name: req.body.global,
      value: req.body.value
    });
    return global.save().then(function () {
      return res.status(200).json(global);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  });

  router.put('/:global', authenticate, login, function (req, res, next) {
    return Globals.update({ name: req.params.globals }, { $set: {
        value: req.body.value
      } }).then(function () {
      return res.status(200).json({ value: req.body.value });
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  });

  router.delete('/:global', authenticate, login, function (req, res, next) {
    return Globals.findOne({ name: req.params.global }).then(function (global) {
      return global.remove();
    }).then(function () {
      return res.status(204).json();
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  });

  app.use('/api/globals', router);
};