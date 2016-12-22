'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _comment = require('../models/comment');

var _comment2 = _interopRequireDefault(_comment);

var _api_error = require('../error/api_error');

var _api_error2 = _interopRequireDefault(_api_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  list: function list(req, res, next) {
    var post = req.params.post;

    _post2.default.findById(post).then(function (post) {
      return res.status(200).json(post.comments);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  },
  create: function create(req, res, next) {
    var post = req.params.post;

    req.body.author = req.user.id;

    _post2.default.findById(post).then(function (post) {
      post.comments.push(new _comment2.default(req.body));
      return post.save();
    }).then(function () {
      return res.status(200).json(req.body);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad Request', 400, err));
    });
  },
  update: function update(req, res, next) {
    var post = req.params.post;
    var comment = req.params.comment;

    req.body.author = undefined;

    _post2.default.findOneAndUpdate({ '_id': post, 'comments._id': comment }, { '$set': { 'comments.$': req.body } }).then(function (comment) {
      return res.status(200).json(comment);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  },
  delete: function _delete(req, res, next) {
    var post = req.params.post;
    var comment = req.params.comment;

    _post2.default.findById(post).then(function (post) {
      post.comments.id(comment).remove();
      return post.save();
    }).then(function () {
      return res.status(204).send();
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  }
};