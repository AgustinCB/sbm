import mongoose from 'mongoose'

import Comment from '../models/comment'

const Post = new mongoose.Schema({
  author: mongoose.Types.ObjectId,
  title: String,
  content: String,
  comments: [Comment]
}, { timestamps: true })

export default mongoose.model('Post', Post)
