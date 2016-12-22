import jwt from 'jsonwebtoken'
import passport from 'passport'

import User from '../models/user'
import ApiError from '../error/api_error'

export default {
  current: (req, res, next) => {
    if (!req.params.id && req.user) return res.status(200).json(req.user)
    if (!req.user && !req.params.id) return res.status(401)
    User.findOne({ username: req.params.id })
      .then((user) => {
        res.status(200).json(user)
      })
      .catch((err) => next(new ApiError('Wrong parameters', 400, err)))
  },
  create: (req, res, next) => {
    User.register(req.body)
      .then((user) => res.status(200).json(user))
      .catch((err) => next(new ApiError('Wrong parameters', 409, err)))
  },
  update: (req, res, next) => {
    req.body.hash = undefined
    req.body.salt = undefined

    User.findOneAndUpdate({ username: req.params.id }, req.body)
      .then((user) => res.status(200).json(user))
      .catch((err) => next(new ApiError('Wrong parameters', 409, err)))
  },
  delete: (req, res, next) => {
    User.remove({ username: req.params.id })
      .then(() => res.status(204).send())
      .catch((err) => next(new ApiError('Wrong parameters', 400, err)))
  },
  authenticate: passport.authenticate('local', { session: false }),
  token: (req, res) => {
    const token = jwt.sign(req.user, 'server secret', { expiresIn: '2h' })
    res.status(200).json({ user: req.user.username, token })
  }
}
