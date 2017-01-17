'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;

var _search = require('./search');

var _search2 = _interopRequireDefault(_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enabledPlugins = [_search2.default];

function load(app, mongoose) {
  enabledPlugins.forEach(function (plugin) {
    return plugin(app, mongoose);
  });
}