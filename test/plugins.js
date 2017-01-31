import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'

import server from '../lib/server'
import User from '../lib/models/user'
import Post from '../lib/models/post'

chai.use(chaiHttp)
const should = chai.should()

const username = 'admin', password = 'test'

describe('#plugins', function() {
  let app, token
  before(function () {
    return server({ username, password }, `localhost/test${Date.now()}`)
      .then((_app) => {
        app = _app
        return chai.request(app)
          .post('/api/auth')
          .send({ username, password })
      })
      .then((res) => {
        res.should.have.status(200)
        res.body.token.should.exist
        token = res.body.token
      })
  })

  describe('#search', function () {
    it('should search for a post', function () {
      let _posts
      return User.findOne({ username: 'admin' })
        .then((user) => {
          const posts = [ 
            new Post({
              author: user.id,
              title: 'Blog entry one keyword',
              content: 'Blog entry content',
            }),
            new Post({
              author: user.id,
              title: 'Blog entry two',
              content: 'Blog entry content keyword',
            }),
            new Post({
              author: user.id,
              title: 'keyword 1',
              content: 'keyword',
            }),
            new Post({
              author: user.id,
              title: 'keyword 2',
              content: 'keyword',
            }),
            new Post({
              author: user.id,
              title: 'keyword 3',
              content: 'keyword',
            }),
            new Post({
              author: user.id,
              title: 'keyword 4',
              content: 'keyword',
            })
          ]

          return Promise.all(posts.map((p) => p.save()))
        })
        .then((posts) => {
          _posts = posts
            .filter((post) => post.title != 'Three')
            .sort((post1, post2) =>
              post1.createdAt.getTime() == post2.createdAt.getTime()
              ? post1.title < post2.title
              : post1.createdAt.getTime() < post2.createdAt.getTime()
            )
          return chai.request(app)
            .get('/api/search/keyword')
        })
        .then((res) => {
          res.should.have.status(200)
          res.body.posts.length.should.equal(5)
          res.body.count.should.equal(6)
         
          res.body.posts[0]._id.toString().should.equal(_posts[0]._id.toString())
          res.body.posts[1]._id.toString().should.equal(_posts[1]._id.toString())
          res.body.posts[2]._id.toString().should.equal(_posts[2]._id.toString())
          res.body.posts[3]._id.toString().should.equal(_posts[3]._id.toString())
          res.body.posts[4]._id.toString().should.equal(_posts[4]._id.toString())
        })
    })
  })

  describe('#category', function () {
    it('should browse in a category', function () {
      let _posts
      return User.findOne({ username: 'admin' })
        .then((user) => {
          const posts = [ 
            new Post({
              author: user.id,
              title: 'Blog entry one keyword',
              content: 'Blog entry content',
              category: 'cat'
            }),
            new Post({
              author: user.id,
              title: 'Blog entry two',
              content: 'Blog entry content keyword',
              category: 'cat'
            }),
            new Post({
              author: user.id,
              title: 'keyword 1',
              content: 'keyword',
              category: 'cat'
            }),
            new Post({
              author: user.id,
              title: 'keyword 2',
              content: 'keyword',
              category: 'cat'
            }),
            new Post({
              author: user.id,
              title: 'keyword 3',
              content: 'keyword',
              category: 'cat'
            }),
            new Post({
              author: user.id,
              title: 'keyword 4',
              content: 'keyword',
              category: 'cat'
            })
          ]

          return Promise.all(posts.map((p) => p.save()))
        })
        .then((posts) => {
          _posts = posts
            .filter((post) => post.title != 'Three')
            .sort((post1, post2) =>
              post1.createdAt.getTime() == post2.createdAt.getTime()
              ? post1.title < post2.title
              : post1.createdAt.getTime() < post2.createdAt.getTime()
            )
          return chai.request(app)
            .get('/api/category/cat')
        })
        .then((res) => {
          res.should.have.status(200)
          res.body.posts.length.should.equal(5)
          res.body.count.should.equal(6)
         
          res.body.posts[0]._id.toString().should.equal(_posts[0]._id.toString())
          res.body.posts[1]._id.toString().should.equal(_posts[1]._id.toString())
          res.body.posts[2]._id.toString().should.equal(_posts[2]._id.toString())
          res.body.posts[3]._id.toString().should.equal(_posts[3]._id.toString())
          res.body.posts[4]._id.toString().should.equal(_posts[4]._id.toString())
        })
    })
  })

  describe('#globals', function () {
    it('should create a global', function () {
      return chai.request(app)
        .post('/api/globals/test')
        .set('Authorization', `Bearer ${token}`)
        .send({
          value: 'test_value'
        })
        .then((res) => {
          res.should.have.status(200)
          res.body.value.should.equal('test_value')
          res.body.name.should.equal('test')
        })
    })

    it('should update a global', function () {
      const { Globals } = mongoose.models

      return chai.request(app)
        .put('/api/globals/test')
        .set('Authorization', `Bearer ${token}`)
        .send({
          value: 'test_value1'
        })
        .then(() => Globals.findOne({ name: 'test' }))
        .then((global) => {
          global.value.should.equal('test_value')
        })
    })

    it('should get a global', function () {
      return chai.request(app)
        .get('/api/globals/test')
        .then((res) => {
          res.should.have.status(200)
          res.body.value.should.equal('test_value')
          res.body.name.should.equal('test')
        })
    })

    it('should get all globals', function () {
      return chai.request(app)
        .post('/api/globals/test1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          value: 'test_value1'
        })
        .then((res) => {
          return chai.request(app)
            .get('/api/globals')
        })
        .then((res) => {
          res.should.have.status(200)
          res.body.length.should.equal(2)
        })
    })

    it('should delete a global', function () {
      const { Globals } = mongoose.models

      return chai.request(app)
        .delete('/api/globals/test')
        .set('Authorization', `Bearer ${token}`)
        .then(() => Globals.findOne({ name: 'test' }))
        .then((global) => {
          should.not.exist(global)
        })
    })
  })

  after(function () {
    return mongoose.connection.db.dropDatabase()
  })
})
