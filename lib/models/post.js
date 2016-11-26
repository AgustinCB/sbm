'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _comment = require('../models/comment');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Post = new _mongoose2.default.Schema({
  author: {
    type: _mongoose2.default.Schema.ObjectId,
    ref: 'User'
  },
  title: String,
  content: String,
  comments: [_comment2.default.schema]
}, { timestamps: true });

exports.default = _mongoose2.default.model('Post', Post);