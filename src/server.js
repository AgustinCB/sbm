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

const app = express()
const router = express.Router()
const authenticate = expressJwt({secret: 'server secret'})
const login = function (req, res, next) {
  if (!req.user) return res.status(401)
  req.user = req.user._doc
  next()
}

mongoose.Promise = Promise

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(passport.initialize())
passport.use(new LocalStrategy(User.authenticate()))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

router.post('/auth', user.authenticate, user.token)

router.get('/user/:id', user.current)
router.post('/user', authenticate, login, user.create)
router.put('/user/:id', authenticate, login, user.update)
router.delete('/user/:id', authenticate, login, user.delete)

router.get('/post', post.list)
router.get('/post/:post', post.get)
router.post('/post', authenticate, login, post.create)
router.put('/post/:post', authenticate, login, post.update)
router.delete('/post/:post', authenticate, login, post.delete)

router.get('/comment/:post', comment.list)
router.post('/comment/:post', authenticate, login, comment.create)
router.put('/comment/:post/:comment', authenticate, login, comment.update)
router.delete('/comment/:post/:comment', authenticate, login, comment.delete)

app.use('/api', router)

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({ error: error.message })
})

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
})

let connected = false

const loadPlugins = (folder) => {
  const plugins = require(folder)
  plugins.default(app, mongoose, authenticate, login)
}

export default function (admin, mongo = 'localhost/sbm', plugins = './plugins') {
  return (connected
    ? Promise.resolve(app)
    : mongoose.connect(`mongodb://${mongo}`))
    .then(() => {
      connected = true
      return User.findOne({ username: admin.username })
    })
    .then((user) => {
      if (user) return Promise.resolve()
      return User.register(Object.assign(admin, { admin: true }))
    })
    .then((user) => loadPlugins(plugins))
    .then(() => app)
    .catch((_) => app)
}
