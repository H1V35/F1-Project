const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    nick: {
      type: String
    },
    username: {
      type: String,
      required: false,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    profileImg: {
      type: String,
      default: 'https://i.stack.imgur.com/l60Hf.png'
    },
    bio: {
      type: String
    },
    team: {
      type: String,
      default: 'None'
    },
    favoritePosts: {
      type: [Schema.Types.ObjectId],
      ref: 'Post'
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER-PREMIUM', 'USER'],
      default: 'USER'
    }
  },
  {
    timestamps: true
  }
)

const User = model('User', userSchema)

module.exports = User
