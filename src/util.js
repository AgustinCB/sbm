import path from 'path'
import promisify from 'promisify-node'
import request from 'superagent'

const fs = promisify('fs')

const home = () => process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']

const config = () => {
  const location = path.join(home(), '.sbm')

  return fs.access(location)
    .then(() => location)
    .catch(() => fs.mkdir(location))
    .then(() => location)
}

class Store {
  constructor (name) {
    this.name = name
    this.file = config().then((configPath) => path.join(configPath, name))
  }

  set (content) {
    return this.file
      .then((filepath) => {
        return fs.writeFile(filepath, content, { flag: 'w' })
      })
      .then(() => content)
  }

  get () {
    return this.file
      .then((filepath) => fs.readFile(filepath))
      .catch(() => undefined)
  }
}

const token = new Store('token')
const url = new Store('url')

const promisifyRequest = req =>
  new Promise((resolve, reject) =>
    req.end((err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  )

class API {
  setUrl (base) {
    return url.set(`${base}/api`)
  }

  setToken (userToken) {
    return token.set(userToken)
  }

  get (path) {
    return this.handler((info) =>
      promisifyRequest(request.get(`${info.url}${path}`))
    )
  }

  post (path, form) {
    return this.handler((info) => {
      const url = `${info.url}${path}`
      const req = request.post(url).send(form)
      if (info.token) {
        req.set('Authorization', `Bearer ${info.token}`)
      }
      return promisifyRequest(req)
    })
  }

  put (path, form) {
    return this.handler((info) => {
      const url = `${info.url}${path}`
      const req = request.put(url).send(form)
        .set('Authorization', `Bearer ${info.token}`)
      return promisifyRequest(req)
    })
  }

  delete (path) {
    return this.handler(function (info) {
      const url = `${info.url}${path}`
      const req = request.delete(url)
        .set('Authorization', `Bearer ${info.token}`)
      return promisifyRequest(req)
    })
  }

  handler (reqFn) {
    return this.getInfo()
      .then(reqFn)
  }

  getInfo () {
    const info = {}
    return url.get()
      .then((url) => {
        info.url = url.toString()
        return token.get()
      })
      .then((token) => {
        info.token = token.toString()
        return info
      })
  }
}

export const api = new API()
