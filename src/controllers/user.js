import jwt from 'jsonwebtoken'
import passport from 'passport'

import User from '../models/user'
import ApiError from '../error/api_error'

export default {
  current: (req, res) => {
    res.status(200).json(req.user);
  },
  create: (req, res) => {
    User.register(req.body)
      .then((user) => res.status(200).json(user))
      .catch((err) => next(new ApiError('Wrong parameters', 400)))
  },
  update: (req, res) => {
    req.body.hash = undefined
    req.body.salt = undefined

    User.findByIdAndUpdate(req.params.id, req.body)
      .then((user) => res.status(200).json(user))
      .catch((err) => next(new ApiError('Wrong parameters', 400)))
  },
  delete: (req, res) => {
    User.remove({ username: req.params.id })
      .then(() => res.status(204))
      .catch((err) => next(new ApiError('Wrong parameters', 400)))
  },
  authenticate: passport.authenticate('local', { session: false }),
  token: (req, res) => {
    const token = jwt.sign(req.user, 'server secret', { expiresIn: '2h' })
    res.status(200).json({ user: req.user.username, token })
  }
}
