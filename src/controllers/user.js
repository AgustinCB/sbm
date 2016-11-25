import jwt from 'jsonwebtoken'
import passport from 'passport'

import User from '../models/user'

export default {
  current: (req, res) => {
    res.status(200).json(req.user);
  },
  create: (req, res) => {
    User.register(req.body)
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(400))
  },
  update: (req, res) => res.status(200).json({}),
  delete: (req, res) => res.status(200).json({}),
  authenticate: passport.authenticate('local', { session: false }),
  token: (req, res) => {
    const token = jwt.sign(req.user, 'server secret', { expiresIn: "2h" })
    res.status(200).json({ user: req.user.username, token })
  }
}
