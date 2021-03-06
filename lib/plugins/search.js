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

  collection.ensureIndex({ content: 'text', title: 'text', category: 'text' });
  Post.schema.index({ content: 'text', title: 'text', category: 'text' });
};

var prepareApp = function prepareApp(app, mongoose) {
  var router = _express2.default.Router();
  var Post = mongoose.models.Post;


  router.get('/:term', function (req, res, next) {
    var term = req.params.term;
    var results = req.query.results || 5;
    var page = req.query.page || 0;
    var searchQuery = Post.find({ $text: { $search: term } }).skip(page * results).sort('-createdAt -title').limit(results).populate('author');

    Promise.all([searchQuery, Post.find({ $text: { $search: term } }).count()]).then(function (results) {
      return res.status(200).json({
        page: page,
        posts: results[0],
        count: results[1]
      });
    }).catch(function (err) {
      return next(new _api_error2.default('Bad request', 400, err));
    });
  });

  app.use('/api/search', router);
};