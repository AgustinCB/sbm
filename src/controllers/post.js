import Post from '../models/post'
import ApiError from '../error/api_error'

export default {
  list: (req, res, next) => {
    const results = req.params.results || 5,
      page = req.params.page || 0

    Post.find({}).skip(page * results).limit(results)
      .then((posts) => res.status(200).json(posts))
      .catch((err) => next(new ApiError('Bad request', 400)))
  },
  create: (req, res, next) => {
    const new_post = new Post(req.body)

    req.body.author = req.user.id

    new_post.save()
      .then((post) => res.status(200).json(post))
      .catch((err) => next(new ApiError('Bad request', 400)))
  },
  update: (req, res, next) => {
    req.body.author = undefined

    Post.findByIdAndUpdate(req.params.post, req.body)
      .then((post) => res.status(200).json(post))
      .catch((err) => next(new ApiError('Bad request', 400)))
  },
  delete: (req, res, next) => {
    Post.remove({ _id: req.params.post })
      .then((post) => res.status(204))
      .catch((err) => next(new ApiError('Bad request', 400)))
  }
}
