export default {
  list: (req, res, next) => {
    const post = req.params.post

    Post.findById(post)
      .then((post) => res.status(200).json(post.comments))
      .catch((err) => next(new ApiError('Bad request', 400)))
  },
  create: (req, res, next) => {
    const post = req.params.post

    Post.findById(post)
      .then((post) => {
        post.push(req.body)
        return post.save()
      })
      .then(() => res.status(200).json(req.body))
      .catch((err) => next(new ApiError('Bad request', 400)))
  },
  update: (req, res, next) => {
    const post = req.params.post,
      comment = req.params.comment

    Post.findOneAndUpdate({ "_id": post, "comments._id": comment },
      { "$set": { "comments.$": req.body } })
      .then((comment) => res.status(200).json(comment))
      .catch((err) => next(new ApiError('Bad request', 400)))
  },
  delete: (req, res, next) => {
    const post = req.params.post,
      comment = req.params.comment

    Post.findById(post)
      .then((post) => {
        post.comments.id(comment).remove()
        return post.save()
      })
      .then(() => res.status(204))
      .catch((err) => next(new ApiError('Bad request', 400)))
  }
}
