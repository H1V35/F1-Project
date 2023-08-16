const router = require('express').Router()
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const User = require('../models/User.model')
const Post = require('../models/Post.model')

// My Profile
router.get('/', (req, res, next) => {
  const user = req.session.currentUser

  Post.find({ owner: user._id })
    .then(posts => {
      res.render('profiles/my-profile', { user, posts })
    })
    .catch(err => console.log(err))
})

// My Profile - Favs
router.get('/favs', (req, res, next) => {
  const user = req.session.currentUser

  res.render('profiles/my-profile-favs', { user })
})

// User-Profile

module.exports = router
