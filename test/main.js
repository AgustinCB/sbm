import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'

import server from '../lib/server'
import User from '../lib/models/user'
import Post from '../lib/models/post'
import Comment from '../lib/models/comment'

chai.use(chaiHttp)
const should = chai.should()

const username = 'admin', password = 'test'

describe('#api', function() {
  let app, token
  before(function () {
    return server({ username, password }, `localhost/test${Date.now()}`)
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
          res.body.count.should.equal(1)
          res.body.posts.length.should.equal(1)
          res.body.posts[0].title.should.equal('Blog entry one')
          res.body.posts[0].content.should.equal('Blog entry content')
          return User.findById(res.body.posts[0].author._id)
        })
        .then((user) => {
          user.username.should.equal('admin')
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
          return User.findById(res.body.author._id)
        })
        .then((user) => {
          user.username.should.equal('admin')
        })
    })

    it('should get a post using title', function () {
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
            .get(`/api/post/${encodeURIComponent('Blog entry one')}`)
        })
        .then((res) => {
          res.should.have.status(200)
          res.body.title.should.equal('Blog entry one')
          res.body.content.should.equal('Blog entry content')
          return User.findById(res.body.author._id)
        })
        .then((user) => {
          user.username.should.equal('admin')
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
          return User.findOne({ _id: res.body.author })
        })
        .then((user) => {
          user.username.should.equal("admin")
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
          post.author.should.exist
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

  describe('#comment', function () {
    it('should returns comments of a post', function () {
      return User.findOne({ username: 'admin' })
        .then((user) => {
          const post = new Post({
            author: user.id,
            title: 'Blog entry one',
            content: 'Blog entry content',
            comments: [
              new Comment({ content: 'Comment one' }),
              new Comment({ content: 'Comment two' })
            ]
          })

          return post.save()
        })
        .then((post) => {
          return chai.request(app)
            .get(`/api/comment/${post.id}`)
            .set('Authorization', `Bearer ${token}`)
        })
        .then((res) => {
          res.should.have.status(200)
          res.body.length.should.equal(2)
          res.body[0].content.should.equal('Comment one')
          res.body[1].content.should.equal('Comment two')
        })
    })

    it('should create a new comment in a post', function () {
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
            .post(`/api/comment/${post.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Comment one' })
        })
        .then((res) => {
          res.should.have.status(200)
          return Post.findById(post_id)
        })
        .then((post) => {
          post.comments.length.should.equal(1)
          post.comments[0].content.should.equal('Comment one')
        })
    })

    it('should update a comment in a post', function () {
      let post_id
      return User.findOne({ username: 'admin' })
        .then((user) => {
          const post = new Post({
            author: user.id,
            title: 'Blog entry one',
            content: 'Blog entry content',
            comments: [
              new Comment({ author: user.id, content: 'Comment one' })
            ]
          })

          return post.save()
        })
        .then((post) => {
          post_id = post.id
          return chai.request(app)
            .put(`/api/comment/${post.id}/${post.comments[0].id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Comment two' })
        })
        .then((res) => {
          res.should.have.status(200)
          return Post.findById(post_id)
        })
        .then((post) => {
          post.comments.length.should.equal(1)
          post.comments[0].content.should.equal('Comment two')
        })
    })

    it('should delete a comment in a post', function () {
      let post_id
      return User.findOne({ username: 'admin' })
        .then((user) => {
          const post = new Post({
            author: user.id,
            title: 'Blog entry one',
            content: 'Blog entry content',
            comments: [
              new Comment({ author: user.id, content: 'Comment one' })
            ]
          })

          return post.save()
        })
        .then((post) => {
          post_id = post.id
          return chai.request(app)
            .delete(`/api/comment/${post.id}/${post.comments[0].id}`)
            .set('Authorization', `Bearer ${token}`)
        })
        .then((res) => {
          res.should.have.status(204)
          return Post.findById(post_id)
        })
        .then((post) => {
          post.comments.length.should.equal(0)
        })
    })
  })

  after(function () {
    return mongoose.connection.db.dropDatabase()
  })
})
