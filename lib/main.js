'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _commands = require('./commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var show = function show(result) {
  return console.log(show);
};

var main = function main(args) {
  switch (args._[0]) {
    case 'start':
      return (0, _commands.start)(args);
    case 'login':
      return (0, _commands.login)(args).then(show);
    case 'read':
      return (0, _commands.read)(args).then(show);
    case 'create':
      return (0, _commands.create)(args).then(show);
    case 'edit':
      return (0, _commands.edit)(args).then(show);
    case 'delete':
      return (0, _commands.del)(args).then(show);
  }

  throw new Error('Wrong command');
};

if (require.main === module) {
  var args = (0, _minimist2.default)(process.argv.slice(2));
  main(args).catch(function (err) {
    return console.log('An error happened!', err);
  });
}