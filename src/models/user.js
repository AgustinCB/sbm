import mongoose from 'mongoose'
import passport from 'passport-local-mongoose'

const User = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  name: String,
  bio: String,
  email: String,
  admin: Boolean
})

User.plugin(passport)

User.statics.passportRegister = User.statics.register
User.statics.register = function(user) {
  return new Promise((resolve, reject) => {
    const password = user.password
    user.password = undefined

    User.statics.passportRegister.bind(UserModel)(new UserModel(user), password, function (err, user) {
      if (err) return reject(err)
      resolve(user)
    })
  })
}
const UserModel = mongoose.model('User', User)
export default UserModel
