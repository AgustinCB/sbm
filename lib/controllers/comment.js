'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  list: function list(req, res, next) {
    var post = req.params.post;

    Post.findById(post).then(function (post) {
      return res.status(200).json(post.comments);
    }).catch(function (err) {
      return next(new ApiError('Bad request', 400));
    });
  },
  create: function create(req, res, next) {
    var post = req.params.post;

    Post.findById(post).then(function (post) {
      post.push(req.body);
      return post.save();
    }).then(function () {
      return res.status(200).json(req.body);
    }).catch(function (err) {
      return next(new ApiError('Bad request', 400));
    });
  },
  update: function update(req, res, next) {
    var post = req.params.post,
        comment = req.params.comment;

    Post.findOneAndUpdate({ "_id": post, "comments._id": comment }, { "$set": { "comments.$": req.body } }).then(function (comment) {
      return res.status(200).json(comment);
    }).catch(function (err) {
      return next(new ApiError('Bad request', 400));
    });
  },
  delete: function _delete(req, res, next) {
    var post = req.params.post,
        comment = req.params.comment;

    Post.findById(post).then(function (post) {
      post.comments.id(comment).remove();
      return post.save();
    }).then(function () {
      return res.status(204);
    }).catch(function (err) {
      return next(new ApiError('Bad request', 400));
    });
  }
};