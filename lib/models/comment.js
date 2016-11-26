'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Comment = new _mongoose2.default.Schema({
  author: _mongoose2.default.Types.ObjectId,
  content: String
}, { timestamps: true });

exports.default = _mongoose2.default.model('Comment', Cmment);