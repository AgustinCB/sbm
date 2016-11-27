import {token, api} from './util'
import server from './server'

const DEFAULT_PORT = 3000

export const start = (args) => {
  if (!args.password) throw new Error("Set an admin password!")

  return server({ username: 'admin', password: args.password }, args.mongo)
    .then((app) => app.listen(args.port || args.p || DEFAULT_PORT))
    .catch((app) => app.listen(args.port || args.p || DEFAULT_PORT))
}

export const login = (args) => {
  if (!args.url || !args.username || !args.password) {
    throw new Error('To login, you need to pass blogs url, username and password')
  }
  const url = args.url, username = args.username, password = args.password

  return api(url)
    .post('/auth', { username, password })
    .then(function (res) {
      return token.set(res.body.token)
    })
    .then((token) => token)
}

export const read = (args) => {
  switch (args._[1]) {
    case 'posts':
      return api()
        .get('/post')
        .then((res) => res.body)
    case 'post':
      return api()
        .get(`/post/${args._[2]}`)
        .then((res) => res.body)
    case 'comments':
      return api()
        .get(`/comment/${args._[2]}`)
        .then((res) => res.body)
    case 'user':
      return api()
        .get(`/user/${args._[2]}`)
        .then((res) => res.body)
  }
}

export const create = (args) => {
  if (!args.data) {
    throw new Error('You need to pass the data to create')
  }
  const data = JSON.parse(data)
  switch (args._[1]) {
    case 'post':
      return api()
        .post('/post', data)
        .then((res) => res.body)
    case 'comments':
      return api()
        .post('/comment', data)
        .then((res) => res.body)
    case 'user':
      return api()
        .post('/user', data)
        .then((res) => res.body)
  }
}

export const edit = (args) => {
  if (!args.data) {
    throw new Error('You need to pass the data to create')
  }
  const data = JSON.parse(data)
  switch (args._[1]) {
    case 'post':
      return api()
        .put('/post', data)
        .then((res) => res.body)
    case 'comments':
      return api()
        .put('/comment', data)
        .then((res) => res.body)
    case 'user':
      return api()
        .put('/user', data)
        .then((res) => res.body)
  }
}

export const del = (args) => {
  switch (args._[1]) {
    case 'post':
      return api()
        .delete(`/post/${args._[2]}`)
        .then((res) => res.body)
    case 'comments':
      return api()
        .delete(`/comment/${args._[2]}`)
        .then((res) => res.body)
    case 'user':
      return api()
        .delete(`/user/${args._[2]}`)
        .then((res) => res.body)
  }
}
