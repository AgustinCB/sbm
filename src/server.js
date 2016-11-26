import express from 'express'
import mongoose from 'mongoose'
import expressJwt from 'express-jwt'
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import bodyParser from 'body-parser'

import User from './models/user'
import user from './controllers/user'
import post from './controllers/post'
import comment from './controllers/comment'

const app = express(),
      router = express.Router(),
      authenticate = expressJwt({secret: 'server secret'})

mongoose.connect('mongodb://localhost/sbm')
mongoose.Promise = Promise

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(passport.initialize())
passport.use(new LocalStrategy(User.authenticate()))

router.post('/auth', user.authenticate, user.token)

router.get('/user', user.current)
router.post('/user', authenticate, user.create)
router.put('/user/:id', authenticate, user.update)
router.delete('/user/:id', authenticate, user.delete)

router.get('/post', post.list)
router.post('/post', authenticate, post.create)
router.put('/post/:post', authenticate, post.update)
router.delete('/post/:post', authenticate, post.delete)

router.get('/comment/:post', comment.list)
router.post('/comment/:post', authenticate, comment.create)
router.put('/comment/:post/:comment', authenticate, comment.update)
router.delete('/comment/:post/:comment', authenticate, comment.delete)

app.use('/api', router)

app.use((error, req, res) => {
  console.log(error.toString())
  res.status(error.status)
  res.json({ error: error.message })
})

export default function (admin) {
  return User.register(Object.assign(admin, {admin: true}))
    .then((user) => app)
    .catch((err) => app)
}
