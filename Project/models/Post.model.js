const { Schema, model } = require('mongoose')

const postSchema = new Schema(
  {
    category: {
      type: String,
      enum: ['GENERAL', 'ALFA_ROMEO', 'ALPHATAURI', 'ALPINE', 'ASTON_MARTIN', 'FERRARI', 'HAAS', 'MCLAREN', 'MERCEDES', 'RED_BULL', 'WILLIAMS'],
      default: 'GENERAL'
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String
    },
    text: {
      type: String
    },
    number_order: {
      type: Number,
      default: 1
    },
    post_id_ref: {
      type: String,
      default: 'main'
    }
  },
  {
    timestamps: true
  }
)

const Post = model('Post', postSchema)

module.exports = Post
