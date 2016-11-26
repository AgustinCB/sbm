'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _api_error = require('../error/api_error');

var _api_error2 = _interopRequireDefault(_api_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  list: function list(req, res, next) {
    var results = req.params.results || 5,
        page = req.params.page || 0;

    _post2.default.find({}).skip(page * results).limit(results).then(function (posts) {
      return res.status(200).json(posts);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400));
    });
  },
  create: function create(req, res, next) {
    var new_post = new _post2.default(req.body);

    new_post.save().then(function (post) {
      return res.status(200).json(post);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400));
    });
  },
  update: function update(req, res, next) {
    _post2.default.findByIdAndUpdate(req.params.post, req.body).then(function (post) {
      return res.status(200).json(post);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400));
    });
  },
  delete: function _delete(req, res, next) {
    _post2.default.remove({ _id: req.params.post }).then(function (post) {
      return res.status(204);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400));
    });
  }
};