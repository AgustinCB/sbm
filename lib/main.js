'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_PORT = 3000;

var main = function main(args) {
  if (args._[0] === 'start') {
    if (!args.password) throw new Error("Set an admin password!");

    return (0, _server2.default)({ username: 'admin', password: args.password }, args.mongo).then(function (app) {
      return app.listen(args.port || args.p || DEFAULT_PORT);
    }).catch(function (app) {
      return app.listen(args.port || args.p || DEFAULT_PORT);
    });
  }

  return Promise.reject(new Error('Wrong command'));
};

if (require.main === module) {
  var args = (0, _minimist2.default)(process.argv.slice(2));
  main(args).catch(function (err) {
    return console.log('An error happened!', err);
  });
}