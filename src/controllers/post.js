import mongoose from 'mongoose'
import Post from '../models/post'
import ApiError from '../error/api_error'

const getType = (value) => {
  try {
    return { _id: mongoose.Types.ObjectId(value) }
  } catch (_) {
    return { title: value }
  }
}

export default {
  list: (req, res, next) => {
    const results = req.query.results || 5
    const page = req.query.page || 0
    const pageQuery = Post.find({})
      .skip(page * results)
      .sort('-createdAt')
      .limit(results)
      .populate('author')

    Promise.all([ pageQuery, Post.find({}).count() ])
      .then((results) => res.status(200).json({
        page,
        posts: results[0],
        count: results[1]
      }))
      .catch((err) => next(new ApiError('Bad request', 400, err)))
  },
  get: (req, res, next) => {
    Post.findOne(getType(req.params.post))
      .populate('author')
      .then((post) => res.status(200).json(post))
      .catch((err) => { console.log(err); return next(new ApiError('Post not found', 404, err)) })
  },
  create: (req, res, next) => {
    const newPost = new Post(req.body)

    newPost.author = req.user._id

    newPost.save()
      .then((post) => res.status(200).json(post))
      .catch((err) => next(new ApiError('Bad request', 400, err)))
  },
  update: (req, res, next) => {
    delete req.body.author

    Post.findByIdAndUpdate(req.params.post, req.body)
      .then((post) => res.status(200).json(post))
      .catch((err) => next(new ApiError('Bad request', 404, err)))
  },
  delete: (req, res, next) => {
    Post.remove({ _id: req.params.post })
      .then((post) => res.status(204).send())
      .catch((err) => next(new ApiError('Bad request', 404, err)))
  }
}
