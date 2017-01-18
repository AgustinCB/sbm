'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app, mongoose) {
  prepareModel(mongoose);
  prepareApp(app, mongoose);
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api_error = require('../error/api_error');

var _api_error2 = _interopRequireDefault(_api_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prepareModel = function prepareModel(mongoose) {
  var collection = mongoose.connections[0].collections.posts;
  var Post = mongoose.models.Post;

  // Ensure text index

  collection.ensureIndex({ content: 'text', title: 'text' });
  Post.schema.index({ content: 'text', title: 'text' });
};

var prepareApp = function prepareApp(app, mongoose) {
  var router = _express2.default.Router();
  var Post = mongoose.models.Post;


  router.get('/:term', function (req, res, next) {
    var term = req.params.term;
    var results = req.query.results || 5;
    var page = req.query.page || 0;

    Post.find({ $text: { $search: term } }).skip(page * results).sort('-createdAt').limit(results).populate('author').then(function (posts) {
      return res.status(200).json(posts);
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  });

  app.use('/api/search', router);
};