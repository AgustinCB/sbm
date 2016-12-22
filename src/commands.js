import {api} from './util'
import server from './server'

const DEFAULT_PORT = 3000

export const start = (args) => {
  if (!args.password) throw new Error('Set an admin password!')

  return server({ username: 'admin', password: args.password }, args.mongo)
    .then((app) => app.listen(args.port || args.p || DEFAULT_PORT))
    .catch((app) => app.listen(args.port || args.p || DEFAULT_PORT))
}

export const login = (args) => {
  if (!args.url || !args.username || !args.password) {
    throw new Error('To login, you need to pass blogs url, username and password')
  }
  const { url, username, password } = args

  return api.setUrl(url)
    .then(() => api.post('/auth', { username, password }))
    .then((res) => {
      return api.setToken(res.body.token)
    })
}

export const read = (args) => {
  switch (args._[1]) {
    case 'posts':
      return api
        .get('/post')
        .then((res) => res.body)
    case 'post':
      return api
        .get(`/post/${args._[2]}`)
        .then((res) => res.body)
    case 'comments':
      return api
        .get(`/comment/${args._[2]}`)
        .then((res) => res.body)
    case 'user':
      return api
        .get(`/user/${args._[2]}`)
        .then((res) => res.body)
  }
}

export const create = (args) => {
  if (!args.data) {
    throw new Error('You need to pass the data to create')
  }
  const data = JSON.parse(args.data)
  switch (args._[1]) {
    case 'post':
      return api
        .post('/post', data)
        .then((res) => res.body)
    case 'comment':
      if (!args.post) {
        throw new Error('You need to pass a post id')
      }
      return api
        .post(`/comment/${args.post}`, data)
        .then((res) => res.body)
    case 'user':
      return api
        .post('/user', data)
        .then((res) => res.body)
  }
}

export const edit = (args) => {
  if (!args.data) {
    throw new Error('You need to pass the data to create')
  }
  const data = JSON.parse(args.data)
  switch (args._[1]) {
    case 'post':
      return api
        .put(`/post/${args._[2]}`, data)
        .then((res) => res.body)
    case 'comment':
      if (!args.post) {
        throw new Error('You need to pass a post id')
      }
      return api
        .put(`/comment/${args.post}/${args._[2]}`, data)
        .then((res) => res.body)
    case 'user':
      return api
        .put(`/user/${args._[2]}`, data)
        .then((res) => res.body)
  }
}

export const del = (args) => {
  switch (args._[1]) {
    case 'post':
      return api
        .delete(`/post/${args._[2]}`)
        .then((res) => res.body)
    case 'comment':
      if (!args.post) {
        throw new Error('You need to pass a post id')
      }
      return api
        .delete(`/comment/${args.post}/${args._[2]}`)
        .then((res) => res.body)
    case 'user':
      return api
        .delete(`/user/${args._[2]}`)
        .then((res) => res.body)
  }
}
