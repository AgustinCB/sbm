import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'

import server from '../lib/server'
import User from '../lib/models/user'
import Post from '../lib/models/post'

chai.use(chaiHttp)
const should = chai.should()

const username = 'admin', password = 'test'

describe('#api', function() {
  let app, token
  before(function () {
    return server({ username, password }, `test${Date.now()}`)
      .then((_app) => app = _app)
  })

  it('should get a token', function () {
    return chai.request(app)
      .post('/api/auth')
      .send({ username, password })
      .then((res) => {
        res.should.have.status(200)
        res.body.token.should.exist
        token = res.body.token
      })
  })

  describe('#user', function () {
    it('should return user info', function () {
      return chai.request(app)
        .get('/api/user/admin')
        .then((res) => {
          res.should.have.status(200)
          res.body.username.should.equal('admin')
        })
    })

    it('should return forbidden access', function () {
      return chai.request(app)
        .post('/api/user')
        .catch((err) => {
          err.status.should.equal(401)
        })
    })

    it('should create a user', function () {
      return chai.request(app)
        .post('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'test',
          password: 'test1',
          admin: false,
          email: 'test@testy.com',
          bio: 'This is a test user'
        })
        .then((res) => {
          res.should.have.status(200)
          return User.findOne({ username: 'test' })
        })
        .then((user) => {
          user.should.exist
          user.username.should.equal('test')
          user.admin.should.equal(false)
          user.email.should.equal('test@testy.com')
          user.bio.should.equal('This is a test user')
        })
    })

    it('should update a user', function () {
      return User.register(new User({ username: 'test1', password: 'test2' }), 'test2')
        .then((user) => {
          return chai.request(app)
            .put('/api/user/test1')
            .set('Authorization', `Bearer ${token}`)
            .send({
              admin: false,
              email: 'test@testy.com',
              bio: 'This is a test user'
            })
        })
        .then((res) => {
          res.should.have.status(200)
          return User.findOne({ username: 'test1' })
        })
        .then((user) => {
          user.admin.should.equal(false)
          user.email.should.equal('test@testy.com')
          user.bio.should.equal('This is a test user')
        })
    })

    it('should not allow two users with same name', function () {
      return User.register(new User({ username: 'test2', password: 'test3' }))
        .then((user) => {
          return chai.request(app)
            .post('/api/user')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'test2' })
        })
        .catch((err) => {
          err.status.should.equal(409)
          return chai.request(app)
            .put('/api/user/admin')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'test2' })
        })
        .catch((err) => {
          err.status.should.equal(409)
        })
    })

    it('should delete users', function () {
      return User.register(new User({ username: 'test3', password: 'test4' }))
        .then((user) => {
          return chai.request(app)
            .delete('/api/user/test3')
            .set('Authorization', `Bearer ${token}`)
        })
        .then((res) => {
          res.should.have.status(204)
          return User.find({ username: 'test3' })
        })
        .then((user) => {
          user.length.should.equal(0)
        })
    })
  })

  describe('#post', function () {
    it('should list posts', function () {
      return User.findOne({ username: 'admin' })
        .then((user) => {
          const post = new Post({
            author: user.id,
            title: 'Blog entry one',
            content: 'Blog entry content',
          })

          return post.save()
        })
        .then(() => {
          return chai.request(app)
            .get('/api/post')
        })
        .then((res) => {
          res.should.have.status(200)
          res.body.length.should.equal(1)
          res.body[0].title.should.equal('Blog entry one')
          res.body[0].content.should.equal('Blog entry content')
        })
    })

    it('should get a post', function () {
      return User.findOne({ username: 'admin' })
        .then((user) => {
          const post = new Post({
            author: user.id,
            title: 'Blog entry one',
            content: 'Blog entry content',
          })

          return post.save()
        })
        .then((post) => {
          return chai.request(app)
            .get(`/api/post/${post.id}`)
        })
        .then((res) => {
          res.should.have.status(200)
          res.body.title.should.equal('Blog entry one')
          res.body.content.should.equal('Blog entry content')
        })
    })

    it('should create a post', function () {
      return chai.request(app)
        .post('/api/post/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Blog entry one',
          content: 'Blog entry content 2'
        })
        .then((res) => {
          res.should.have.status(200)
          res.body.title.should.equal('Blog entry one')
          res.body.content.should.equal('Blog entry content 2')
        })
    })

    it('should update a post', function () {
      return User.findOne({ username: 'admin' })
        .then((user) => {
          const post = new Post({
            author: user.id,
            title: 'Blog entry one',
            content: 'Blog entry content',
          })

          return post.save()
        })
        .then((post) => {
          return chai.request(app)
            .put(`/api/post/${post.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              title: 'Blog entry one 2',
              content: 'Blog entry content 2'
            })
        })
        .then((res) => {
          res.should.have.status(200)
          return Post.findById(res.body._id)
        })
        .then((post) => {
          post.title.should.equal('Blog entry one 2')
          post.content.should.equal('Blog entry content 2')
        })
    })

    it('should delete a post', function () {
      let post_id
      return User.findOne({ username: 'admin' })
        .then((user) => {
          const post = new Post({
            author: user.id,
            title: 'Blog entry one',
            content: 'Blog entry content',
          })

          return post.save()
        })
        .then((post) => {
          post_id = post.id
          return chai.request(app)
            .delete(`/api/post/${post.id}`)
            .set('Authorization', `Bearer ${token}`)
        })
        .then((res) => {
          res.should.have.status(204)
          return Post.find({ _id: post_id })
        })
        .then((post) => {
          post.length.should.equal(0)
        })
    })
  })

  after(function () {
    return mongoose.connection.db.dropDatabase()
  })
})
