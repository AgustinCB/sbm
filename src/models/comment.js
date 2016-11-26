import mongoose from 'mongoose'

const Comment = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  content: String
}, { timestamps: true })

export default mongoose.model('Comment', Comment)
