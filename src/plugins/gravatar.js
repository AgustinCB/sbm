const prepareModel = (mongoose) => {
  const { User } = mongoose.models
  const UserSchema = User.schema

  UserSchema.add({
    gravatar: String
  })
}

export default function (app, mongoose, authenticate, login) {
  prepareModel(mongoose)
}
