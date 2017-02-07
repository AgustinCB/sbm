'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (args) {
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

var _commands = require('./commands');

var show = function show(result) {
  return console.log(result);
};