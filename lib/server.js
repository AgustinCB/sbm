'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (admin) {
  var mongo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'localhost/sbm';
  var plugins = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : './plugins';

  return (connected ? Promise.resolve(app) : _mongoose2.default.connect('mongodb://' + mongo)).then(function () {
    connected = true;
    return _user2.default.findOne({ username: admin.username });
  }).then(function (user) {
    if (user) return Promise.resolve();
    return _user2.default.register(Object.assign(admin, { admin: true }));
  }).then(function (user) {
    return loadPlugins(plugins);
  }).then(function () {
    return app;
  }).catch(function (_) {
    return app;
  });
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('./controllers/user');

var _user4 = _interopRequireDefault(_user3);

var _post = require('./controllers/post');

var _post2 = _interopRequireDefault(_post);

var _comment = require('./controllers/comment');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var router = _express2.default.Router();
var authenticate = (0, _expressJwt2.default)({ secret: 'server secret' });
var login = function login(req, res, next) {
  if (!req.user) return res.status(401);
  req.user = req.user._doc;
  next();
};

_mongoose2.default.Promise = Promise;

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded());
app.use(_passport2.default.initialize());
_passport2.default.use(new _passportLocal.Strategy(_user2.default.authenticate()));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.post('/auth', _user4.default.authenticate, _user4.default.token);

router.get('/user/:id', _user4.default.current);
router.post('/user', authenticate, login, _user4.default.create);
router.put('/user/:id', authenticate, login, _user4.default.update);
router.delete('/user/:id', authenticate, login, _user4.default.delete);

router.get('/post', _post2.default.list);
router.get('/post/:post', _post2.default.get);
router.post('/post', authenticate, login, _post2.default.create);
router.put('/post/:post', authenticate, login, _post2.default.update);
router.delete('/post/:post', authenticate, login, _post2.default.delete);

router.get('/comment/:post', _comment2.default.list);
router.post('/comment/:post', authenticate, login, _comment2.default.create);
router.put('/comment/:post/:comment', authenticate, login, _comment2.default.update);
router.delete('/comment/:post/:comment', authenticate, login, _comment2.default.delete);

app.use('/api', router);

app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({ error: error.message });
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var connected = false;

var loadPlugins = function loadPlugins(folder) {
  var plugins = require(folder);
  plugins.default(app, _mongoose2.default, authenticate, login);
};