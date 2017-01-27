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
    name: { type: String, unique: true },
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

  router.post('/:global', authenticate, login, function (req, res, next) {
    var global = new Globals({
      name: req.params.global,
      value: req.body.value
    });
    return global.save().then(function () {
      return res.status(200).json(global);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  });

  app.use('/api/globals', router);
};