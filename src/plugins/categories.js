import express from 'express'
import ApiError from '../error/api_error'

const prepareModel = (mongoose) => {
  const { Post } = mongoose.models
  const PostSchema = Post.schema

  PostSchema.add({
    category: String
  })
}

const prepareApp = (app, mongoose) => {
  const router = express.Router()
  const { Post } = mongoose.models

  router.get('/:category', (req, res, next) => {
    const category = req.params.category
    const results = req.query.results || 5
    const page = req.query.page || 0
    const searchQuery = Post.find({ category })
      .skip(page * results)
      .sort('-createdAt -title')
      .limit(results)
      .populate('author')

    Promise.all([ searchQuery, Post.find({ category }).count() ])
      .then((results) => res.status(200).json({
        page,
        posts: results[0],
        count: results[1]
      }))
      .catch((err) => next(new ApiError('Bad request', 400, err)))
  })

  app.use('/api/category', router)
}

export default function (app, mongoose) {
  prepareModel(mongoose)
  prepareApp(app, mongoose)
}
