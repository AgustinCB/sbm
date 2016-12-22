'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = (0, _promisifyNode2.default)('fs');

var home = function home() {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
};

var config = function config() {
  var location = _path2.default.join(home(), '.sbm');

  return fs.access(location).then(function () {
    return location;
  }).catch(function () {
    return fs.mkdir(location);
  }).then(function () {
    return location;
  }).catch(function () {
    return location;
  });
};

var Store = function () {
  function Store(name) {
    _classCallCheck(this, Store);

    this.name = name;
    this.file = config().then(function (configPath) {
      return _path2.default.join(configPath, name);
    });
  }

  _createClass(Store, [{
    key: 'set',
    value: function set(content) {
      return this.file.then(function (filepath) {
        return fs.writeFile(filepath, content, { flag: 'w' });
      }).then(function () {
        return content;
      });
    }
  }, {
    key: 'get',
    value: function get() {
      return this.file.then(function (filepath) {
        return fs.readFile(filepath);
      }).catch(function () {
        return undefined;
      });
    }
  }]);

  return Store;
}();

var token = new Store('token');
var url = new Store('url');

var promisifyRequest = function promisifyRequest(req) {
  return new Promise(function (resolve, reject) {
    return req.end(function (err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

var API = function () {
  function API() {
    _classCallCheck(this, API);
  }

  _createClass(API, [{
    key: 'setUrl',
    value: function setUrl(base) {
      return url.set(base + '/api');
    }
  }, {
    key: 'setToken',
    value: function setToken(userToken) {
      return token.set(userToken);
    }
  }, {
    key: 'get',
    value: function get(path) {
      return this.handler(function (info) {
        return promisifyRequest(_superagent2.default.get('' + info.url + path));
      });
    }
  }, {
    key: 'post',
    value: function post(path, form) {
      return this.handler(function (info) {
        var url = '' + info.url + path;
        var req = _superagent2.default.post(url).send(form);
        if (info.token) {
          req.set('Authorization', 'Bearer ' + info.token);
        }
        return promisifyRequest(req);
      });
    }
  }, {
    key: 'put',
    value: function put(path, form) {
      return this.handler(function (info) {
        var url = '' + info.url + path;
        var req = _superagent2.default.put(url).send(form).set('Authorization', 'Bearer ' + info.token);
        return promisifyRequest(req);
      });
    }
  }, {
    key: 'delete',
    value: function _delete(path) {
      return this.handler(function (info) {
        var url = '' + info.url + path;
        var req = _superagent2.default.delete(url).set('Authorization', 'Bearer ' + info.token);
        return promisifyRequest(req);
      });
    }
  }, {
    key: 'handler',
    value: function handler(reqFn) {
      return this.getInfo().then(reqFn);
    }
  }, {
    key: 'getInfo',
    value: function getInfo() {
      var info = {};
      return url.get().then(function (url) {
        info.url = url.toString();
        return token.get();
      }).then(function (token) {
        info.token = token ? token.toString() : undefined;
        return info;
      });
    }
  }]);

  return API;
}();

var api = exports.api = new API();