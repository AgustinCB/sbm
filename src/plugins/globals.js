import express from 'express'
import ApiError from '../error/api_error'

const prepareModel = (mongoose) => {
  const Globals = new mongoose.Schema({
    name: String,
    value: String
  })

  mongoose.model('Globals', Globals)
}

const prepareApp = (app, mongoose, authenticate, login) => {
  const router = express.Router()
  const { Globals } = mongoose.models

  router.get('/', (req, res, next) => {
    return Globals.find({ })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(new ApiError('Bad request', 400, err)))
  })

  router.get('/:global', (req, res, next) => {
    return Globals.findOne({ name: req.params.global })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(new ApiError('Bad request', 400, err)))
  })

  router.post('/:global', authenticate, login, (req, res, next) => {
    const global = new Globals({
      name: req.params.global,
      value: req.body.value
    })
    return global.save()
      .then(() => res.status(200).json(global))
      .catch((err) => next(new ApiError('Bad request', 400, err)))
  })

  app.use('/api/globals', router)
}

export default function (app, mongoose, authenticate, login) {
  prepareModel(mongoose)
  prepareApp(app, mongoose, authenticate, login)
}
