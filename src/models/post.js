import mongoose from 'mongoose'

import Comment from '../models/comment'

const Post = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  title: String,
  content: String,
  comments: [Comment.schema]
}, { timestamps: true })

export default mongoose.model('Post', Post)
