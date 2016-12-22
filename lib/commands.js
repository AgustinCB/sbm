'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.del = exports.edit = exports.create = exports.read = exports.login = exports.start = undefined;

var _util = require('./util');

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_PORT = 3000;

var start = exports.start = function start(args) {
  if (!args.password) throw new Error('Set an admin password!');

  return (0, _server2.default)({ username: 'admin', password: args.password }, args.mongo).then(function (app) {
    return app.listen(args.port || args.p || DEFAULT_PORT);
  }).catch(function (app) {
    return app.listen(args.port || args.p || DEFAULT_PORT);
  });
};

var login = exports.login = function login(args) {
  if (!args.url || !args.username || !args.password) {
    throw new Error('To login, you need to pass blogs url, username and password');
  }
  var url = args.url,
      username = args.username,
      password = args.password;


  return _util.api.setUrl(url).then(function () {
    return _util.api.post('/auth', { username: username, password: password });
  }).then(function (res) {
    return _util.api.setToken(res.body.token);
  });
};

var read = exports.read = function read(args) {
  switch (args._[1]) {
    case 'posts':
      return _util.api.get('/post').then(function (res) {
        return res.body;
      });
    case 'post':
      return _util.api.get('/post/' + args._[2]).then(function (res) {
        return res.body;
      });
    case 'comments':
      return _util.api.get('/comment/' + args._[2]).then(function (res) {
        return res.body;
      });
    case 'user':
      return _util.api.get('/user/' + args._[2]).then(function (res) {
        return res.body;
      });
  }
};

var create = exports.create = function create(args) {
  if (!args.data) {
    throw new Error('You need to pass the data to create');
  }
  var data = JSON.parse(args.data);
  switch (args._[1]) {
    case 'post':
      return _util.api.post('/post', data).then(function (res) {
        return res.body;
      });
    case 'comment':
      if (!args.post) {
        throw new Error('You need to pass a post id');
      }
      return _util.api.post('/comment/' + args.post, data).then(function (res) {
        return res.body;
      });
    case 'user':
      return _util.api.post('/user', data).then(function (res) {
        return res.body;
      });
  }
};

var edit = exports.edit = function edit(args) {
  if (!args.data) {
    throw new Error('You need to pass the data to create');
  }
  var data = JSON.parse(args.data);
  switch (args._[1]) {
    case 'post':
      return _util.api.put('/post/' + args._[2], data).then(function (res) {
        return res.body;
      });
    case 'comment':
      if (!args.post) {
        throw new Error('You need to pass a post id');
      }
      return _util.api.put('/comment/' + args.post + '/' + args._[2], data).then(function (res) {
        return res.body;
      });
    case 'user':
      return _util.api.put('/user/' + args._[2], data).then(function (res) {
        return res.body;
      });
  }
};

var del = exports.del = function del(args) {
  switch (args._[1]) {
    case 'post':
      return _util.api.delete('/post/' + args._[2]).then(function (res) {
        return res.body;
      });
    case 'comment':
      if (!args.post) {
        throw new Error('You need to pass a post id');
      }
      return _util.api.delete('/comment/' + args.post + '/' + args._[2]).then(function (res) {
        return res.body;
      });
    case 'user':
      return _util.api.delete('/user/' + args._[2]).then(function (res) {
        return res.body;
      });
  }
};