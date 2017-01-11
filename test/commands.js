import chai from 'chai'

import {start, login, read, create, edit, del} from '../lib/commands'
import Post from '../lib/models/post'
import Comment from '../lib/models/comment'
import User from '../lib/models/user'

const should = chai.should()

describe('#commands', () => {
  let app
  before(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        start({
          username: 'admin',
          password: 'admin'
        }).then(resolve)
      }, 1)
    })
      .then((_app) => app = _app)
  })

  it('should login you to an url', () => {
    const args = {
      username: 'admin',
      password: 'admin',
      url: 'http://localhost:3000'
    }

    return login(args)
      .then((token) => {
        token.should.exist
      })
  })

  describe('#read', () => {
    let posts
    before(() => {
      return User.findOne({ username: 'admin' })
        .then((user) =>
          Promise.all([
            (new Post({
              author: user.id,
              title: 'Post 1',
              content: 'Content 1'
            })).save(),
            (new Post({
              author: user.id,
              title: 'Post 2',
              content: 'Content 2'
            })).save(),
            (new Post({
              author: user.id,
              title: 'Post 3',
              content: 'Content 3'
            })).save(),
            (new Post({
              author: user.id,
              title: 'Post 3',
              content: 'Content 4'
            })).save(),
            (new Post({
              author: user.id,
              title: 'Post 3',
              content: 'Content 5'
            })).save(),
            (new Post({
              author: user.id,
              title: 'Post 4',
              content: 'Content 6',
              comments: [
                {
                  author: user.id,
                  content: 'Comment 1'
                },
                {
                  author: user.id,
                  content: 'Comment 2'
                }
              ]
            })).save()
          ])
        )
        .then((_posts) => posts = _posts.sort((post1, post2) =>
          post1.createdAt.getTime() < post2.createdAt.getTime()
        ))
    })

    it('should read blog posts', () => {
      return read({ _: [ 'read', 'posts' ] })
        .then((_posts) => {
          _posts.count.should.equal(6)
          posts.slice(0, -1).forEach((post, index) =>
            post._id.toString().should.equal(_posts.posts[index]._id.toString())
          )
        })
    })

    it('should read a blog post', () => {
      return read({ _: [ 'read', 'post', posts[0]._id ] })
        .then((post) => {
          post._id.should.equal(posts[0].id.toString())
        })
    })

    it('should read a user', () => {
      return read({ _: [ 'read', 'user', 'admin' ] })
        .then((user) => {
          user.username.should.equal('admin')
          user.admin.should.equal(true)
        })
    })

    it('should read comments from a post', () => {
      return read({ _: [ 'read', 'comments', posts[5]._id ] })
        .then((comments) => {
          posts[5].comments.length.should.equal(comments.length)
          posts[5].comments.forEach((comment, index) =>
            comment.id.should.equal(posts[5].comments[index].id.toString())
          )
        })
    })
  })

  describe('#create', () => {
    it('should create a post with expanded arguments', () => {
      return create({
        _: [ 'create', 'post' ],
        content: 'Ford Prefect',
        title: 'Dont panic'
      })
        .then((res) =>
          Post.findById(res._id)
        )
        .then((post) => {
          post.content.should.equal('Ford Prefect')
          post.title.should.equal('Dont panic')
        })
    })

    it('should create a post', () => {
      const post = JSON.stringify({
        content: 'Ford Prefect',
        title: 'Dont panic'
      })
      return create({ _: [ 'create', 'post' ], data: post })
        .then((res) =>
          Post.findById(res._id)
        )
        .then((post) => {
          post.content.should.equal('Ford Prefect')
          post.title.should.equal('Dont panic')
        })
    })

    it('should create a comment', () => {
      let commentPost
      return
        (new Post({
          title: 'Ford Perfect',
          content: 'Dont panic'
        })).save()
        .then((post) => {
          const comment = JSON.stringify({
            content: 'Goodbye and thank you for the fish',
          })
          commentPost = post
          return create({
            _: [ 'create', 'comment' ],
            data: comment,
            post: post._id
          })
        })
        .then((res) =>
          Post.findById(commentPost._id)
        )
        .then((post) => {
          post.comments[0].content.should.equal('Goodbye and thank you for the fish')
        })
    })

    it('should create a user', () => {
      const user = JSON.stringify({
        username: 'testuser',
        password: 'test1',
        admin: false,
        email: 'test@testy.com',
        bio: 'This is a test user'
      })
      return create({ _: [ 'create', 'user' ], data: user })
        .then((user) =>
          User.findById(user._id)
        )
        .then((user) => {
          user.username.should.equal('testuser')
          user.email.should.equal('test@testy.com')
        })
    })
  })

  describe('#edit', () => {
    it('should edit a post with expanded arguments', () => {
      const post = new Post({
        content: 'Ford Prefect',
        title: 'Dont panic'
      })

      return post.save()
        .then(() => edit({
          _: [ 'edit', 'post', post._id ],
          content: 'Ford Perfect'
        }))
        .then(() => Post.findById(post.id))
        .then((post) => post.content.should.equal('Ford Perfect'))
    })

    it('should edit a post', () => {
      const post = new Post({
        content: 'Ford Prefect',
        title: 'Dont panic'
      })

      return post.save()
        .then(() => edit({
          _: [ 'edit', 'post', post._id ],
          data: JSON.stringify({ content: 'Ford Perfect' })
        }))
        .then(() => Post.findById(post.id))
        .then((post) => post.content.should.equal('Ford Perfect'))
    })

    it('should edit a comment', () => {
      const post = new Post({
        content: 'Ford Prefect',
        title: 'Dont panic',
        comments: [{
          content: 'No, really, dont panic'
        }]
      })

      return post.save()
        .then((post) =>
          edit({
            _: [ 'edit', 'comment', post.comments[0]._id ],
            post: post._id,
            data: JSON.stringify({ content: 'Please, panic' })
          })
        )
        .then(() => Post.findById(post.id))
        .then((post) =>
          post.comments[0].content.should.equal('Please, panic')
        )
    })

    it('should edit a user', () => {
      const user = {
        username: 'testuser ' + Date.now(),
        password: 'test1',
        admin: false,
        email: 'test@testy.com',
        bio: 'This is a test user'
      }

      return User.register(user)
        .then((user) =>
          edit({
            _: [ 'edit', 'user', user.username ],
            data: JSON.stringify({ bio: 'AgustinCB is cool' })
          })
        )
        .then(() => User.findOne({ username: user.username }))
        .then((user) => user.bio.should.equal('AgustinCB is cool'))
    })
  })

  describe('#del', () => {
    it('should remove a post', () => {
      const post = new Post({
        content: 'Ford Prefect',
        title: 'Dont panic'
      })

      return post.save()
        .then(() => del({ _: [ 'delete', 'post', post._id ] }))
        .then(() => Post.findById(post.id))
        .then((post) => should.not.exist(post))
    })

    it('should remove a commment', () => {
      const post = new Post({
        content: 'Ford Prefect',
        title: 'Dont panic',
        comments: [{
          content: 'No, really, dont panic'
        }]
      })

      return post.save()
        .then((post) =>
          del({
            _: [ 'delete', 'comment', post.comments[0]._id ],
            post: post._id,
          })
        )
        .then(() => Post.findById(post.id))
        .then((post) => post.comments.length.should.equal(0))
    })

    it('should remove a user', () => {
      const user = {
        username: 'testuser ' + Date.now(),
        password: 'test1',
        admin: false,
        email: 'test@testy.com',
        bio: 'This is a test user'
      }

      return User.register(user)
        .then((user) =>
          del({ _: [ 'delete', 'user', user.username ] })
        )
        .then(() => User.findOne({ username: user.username }))
        .then((user) => should.not.exist(user))
    })
  })

  after(() => {
    return Post.remove({})
      .then(() => User.remove({}))
  })

  after(() => {
    return new Promise((resolve, reject) => {
      app.close((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  })
})
