import express from 'express'
import ApiError from '../error/api_error'

const prepareModel = (mongoose) => {
  const collection = mongoose.connections[0].collections.posts
  const { Post } = mongoose.models

  // Ensure text index
  collection.ensureIndex({ content: 'text', title: 'text' })
  Post.schema.index({ content: 'text', title: 'text' })
}

const prepareApp = (app, mongoose) => {
  const router = express.Router()
  const { Post } = mongoose.models

  router.get('/:term', (req, res, next) => {
    const term = req.params.term

    Post.find({ $text: { $search: term } })
      .sort('-createdAt -title')
      .populate('author')
      .then((posts) => res.status(200).json(posts))
      .catch((err) => next(new ApiError('Bad request', 400, err)))
  })

  app.use('/api/search', router)
}

export default function (app, mongoose) {
  prepareModel(mongoose)
  prepareApp(app, mongoose)
}
