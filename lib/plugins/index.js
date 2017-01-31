'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;

var _search = require('./search');

var _search2 = _interopRequireDefault(_search);

var _categories = require('./categories');

var _categories2 = _interopRequireDefault(_categories);

var _gravatar = require('./gravatar');

var _gravatar2 = _interopRequireDefault(_gravatar);

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enabledPlugins = [_categories2.default, _search2.default, _globals2.default, _gravatar2.default];

function load(app, mongoose, authenticate, login) {
  enabledPlugins.forEach(function (plugin) {
    return plugin(app, mongoose, authenticate, login);
  });
}