import mongoose from 'mongoose'

const Post = new mongoose.Schema({
  author: mongoose.Types.ObjectId,
  title: String,
  content: String
}, { timestamps: true })

export default mongoose.model('Post', Post)
