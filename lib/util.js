'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = exports.token = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = (0, _promisifyNode2.default)('fs');

var home = function home() {
  return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
};

var config = function config() {
  var location = _path2.default.join(home(), '.sbm');

  return fs.access(location).then(function () {
    return location;
  }).catch(function () {
    return fs.mkdir(location);
  }).then(function () {
    return location;
  });
};

var token = exports.token = {
  file: _path2.default.join(config(), 'token'),
  set: function set(token) {
    return fs.writeFile(this.file, token).then(function () {
      return token;
    });
  },
  get: function get() {
    return fs.readFile(this.file);
  }
};

var api = exports.api = function api(base) {
  var url = base + '/api';
  var save = function save() {
    if (url) return Promise.resolve();
    return fs.writeFile(_path2.default.join(config(), 'url'), url);
  };
  var getUrl = function getUrl() {
    if (base) return Promise.resolve(url);
    return fs.readFile(_path2.default.join(config(), 'url'));
  };
  var getInfo = function getInfo() {
    var url = void 0;
    return getUrl().then(function (_url) {
      url = _url;
      return token.get();
    }).then(function (token) {
      token, url;
    }).catch(function () {
      token: '', url;
    });
  };
  var handler = function handler(callback) {
    return getInfo().then(function (info) {
      return callback(info);
    }).then(save);
  };

  return {
    get: function get(path) {
      return handler(function (info) {
        return new Promise(function (resolve, reject) {
          _request2.default.get({ url: '' + info.url + path, form: form }, function (err, res) {
            if (err) return reject(err);
            resolve(res);
          });
        });
      });
    },
    post: function post(path, form) {
      return handler(function (info) {
        var headers = {
          'Authorization': 'Bearer ' + info.token
        };
        return new Promise(function (resolve, reject) {
          _request2.default.post({ url: '' + info.url + path, form: form, headers: headers }, function (err, res) {
            if (err) return reject(err);
            resolve(res);
          });
        });
      });
    },
    put: function put(path, form) {
      return handler(function (info) {
        var headers = {
          'Authorization': 'Bearer ' + info.token
        };
        return new Promise(function (resolve, reject) {
          _request2.default.put({ url: '' + info.url + path, form: form, headers: headers }, function (err, res) {
            if (err) return reject(err);
            resolve(res);
          });
        });
      });
    },
    delete: function _delete(path) {
      return handler(function (info) {
        return new Promise(function (resolve, reject) {
          _request2.default.delete({ url: '' + info.url + path, form: form }, function (err, res) {
            if (err) return reject(err);
            resolve(res);
          });
        });
      });
    }
  };
};