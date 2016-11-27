import path from 'path'
import promisify from 'promisify-node'
import request from 'request'

const fs = promisify('fs')

const home = () => process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']

const config = () => {
  const location = path.join(home(), '.sbm')

  return fs.access(location)
    .then(() => location)
    .catch(() => fs.mkdir(location))
    .then(() => location)
}

export const token = {
  file: path.join(config(), 'token'),
  set: function (token) {
    return fs.writeFile(this.file, token)
      .then(() => token)
  },
  get: function () {
    return fs.readFile(this.file)
  }
}

export const api = function (base) {
  const url = `${base}/api`
  const save = () => {
    if (url) return Promise.resolve()
    return fs.writeFile(path.join(config(), 'url'), url)
  }
  const getUrl = () => {
    if (base) return Promise.resolve(url)
    return fs.readFile(path.join(config(), 'url'))
  }
  const getInfo = () => {
    let url
    return getUrl()
      .then((_url) => {
        url = _url
        return token.get()
      })
      .then((token) => { token, url })
      .catch(() => { token: '', url })
  }
  const handler = (callback) => {
    return getInfo()
      .then((info) => callback(info))
      .then(save)
  }

  return {
    get: function (path) {
      return handler(function (info) {
        return new Promise((resolve, reject) => {
          request.get({ url: `${info.url}${path}`, form }, function (err, res) {
            if (err) return reject(err)
            resolve(res)
          })
        })
      })
    },
    post: function (path, form) {
      return handler(function (info) {
        const headers = {
          'Authorization': `Bearer ${info.token}`
        }
        return new Promise((resolve, reject) => {
          request.post({ url: `${info.url}${path}`, form, headers }, function (err, res) {
            if (err) return reject(err)
            resolve(res)
          })
        })
      })
    },
    put: function (path, form) {
      return handler(function (info) {
        const headers = {
          'Authorization': `Bearer ${info.token}`
        }
        return new Promise((resolve, reject) => {
          request.put({ url: `${info.url}${path}`, form, headers }, function (err, res) {
            if (err) return reject(err)
            resolve(res)
          })
        })
      })
    },
    delete: function (path) {
      return handler(function (info) {
        return new Promise((resolve, reject) => {
          request.delete({ url: `${info.url}${path}`, form }, function (err, res) {
            if (err) return reject(err)
            resolve(res)
          })
        })
      })
    }
  }
}
