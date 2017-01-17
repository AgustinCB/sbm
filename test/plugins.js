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
      .then((_app) => app = _app)
  })

  it('should should search for a post', function () {
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
            title: 'Three',
            content: 'Three I said',
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
        res.body.length.should.equal(2)
       
        res.body[0]._id.toString().should.equal(_posts[0]._id.toString())
        res.body[1]._id.toString().should.equal(_posts[1]._id.toString())
      })
  })

  after(function () {
    return mongoose.connection.db.dropDatabase()
  })
})
