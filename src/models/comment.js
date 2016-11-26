import mongoose from 'mongoose'

const Comment = new mongoose.Schema({
  author: mongoose.Types.ObjectId,
  content: String
}, { timestamps: true })

export default mongoose.model('Comment', Cmment)
