const router = require('express').Router()
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const User = require('../models/User.model')
const Post = require('../models/Post.model')

// My Profile - Posts
router.get('/', (req, res, next) => {
  const user = req.session.currentUser

  Post.find({ $and: [{ category: 'GENERAL' }, { owner: user._id }, { post_id_ref: 'main' }] })
    .then(posts => {
      res.render('profiles/my_profile', { user, posts })
    })
    .catch(err => console.log(err))
})

// My Profile - Team_Posts
router.get('/posts/:team', (req, res, next) => {
  const user = req.session.currentUser

  Post.find({ $and: [{ category: user.team }, { owner: user._id }, { post_id_ref: 'main' }] })
    .then(posts => {
      res.render('profiles/my_profile-team_posts', { user, posts })
    })
    .catch(err => console.log(err))
})

// My Profile - Favs
router.get('/favs', (req, res, next) => {
  const user = req.session.currentUser

  User.findById(user._id)
    .populate('favoritePosts')
    .then(user => res.render('profiles/my_profile-favs', { user }))
})
// User-Profile

module.exports = router
