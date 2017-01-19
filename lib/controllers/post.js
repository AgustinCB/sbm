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
    var results = req.query.results || 5;
    var page = req.query.page || 0;
    var pageQuery = _post2.default.find({}).skip(page * results).sort('-createdAt').limit(results).populate('author');

    Promise.all([pageQuery, _post2.default.find({}).count()]).then(function (results) {
      return res.status(200).json({
        page: page,
        posts: results[0],
        count: results[1]
      });
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  },
  get: function get(req, res, next) {
    _post2.default.findById(req.params.post).populate('author').then(function (post) {
      return res.status(200).json(post);
    }).catch(function (err) {
      return next(new _api_error2.default('Post not found', 404, err));
    });
  },
  create: function create(req, res, next) {
    var newPost = new _post2.default(req.body);

    newPost.author = req.user._id;

    newPost.save().then(function (post) {
      return res.status(200).json(post);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  },
  update: function update(req, res, next) {
    delete req.body.author;

    _post2.default.findByIdAndUpdate(req.params.post, req.body).then(function (post) {
      return res.status(200).json(post);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 404, err));
    });
  },
  delete: function _delete(req, res, next) {
    _post2.default.remove({ _id: req.params.post }).then(function (post) {
      return res.status(204).send();
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 404, err));
    });
  }
};