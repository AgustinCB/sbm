import express from 'express'
import ApiError from '../error/api_error'

const prepareModel = (mongoose) => {
  const collection = mongoose.connections[0].collections.posts
  const { Post } = mongoose.models

  // Ensure text index
  collection.ensureIndex({ content: 'text', title: 'text', category: 'text' })
  Post.schema.index({ content: 'text', title: 'text', category: 'text' })
}

const prepareApp = (app, mongoose) => {
  const router = express.Router()
  const { Post } = mongoose.models

  router.get('/:term', (req, res, next) => {
    const term = req.params.term
    const results = req.query.results || 5
    const page = req.query.page || 0
    const searchQuery = Post.find({ $text: { $search: term } })
      .skip(page * results)
      .sort('-createdAt -title')
      .limit(results)
      .populate('author')

    Promise.all([ searchQuery, Post.find({ $text: { $search: term } }).count() ])
      .then((results) => res.status(200).json({
        page,
        posts: results[0],
        count: results[1]
      }))
      .catch((err) => next(new ApiError('Bad request', 400, err)))
  })

  app.use('/api/search', router)
}

export default function (app, mongoose) {
  prepareModel(mongoose)
  prepareApp(app, mongoose)
}
