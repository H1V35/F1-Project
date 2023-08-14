const Schema = require('mongoose').Schema

const postSchema = new Schema(
  {
    title: {
      type: String
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    description: {
      type: String
    },
    number_order: {
      type: Number
    },
    post_id_ref: {
      type: String,
      default: 'main'
    }
    // favorites: {
    //   type: [Schema.Types.ObjectId],
    //   ref: 'User'
    // }
  },
  {
    timestamps: true
  }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
