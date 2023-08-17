const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
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
    team: {
      type: String,
      default: 'NONE'
    },
    bio: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: 'https://i.stack.imgur.com/l60Hf.png'
    },
    favoritePosts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
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
