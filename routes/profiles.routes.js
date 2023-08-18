const router = require('express').Router()
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const User = require('../models/User.model')
const Post = require('../models/Post.model')

// My Profile - Posts
router.get('/', isLoggedIn, (req, res, next) => {
  const { currentUser: user } = req.session

  User.findById(user._id)
    .then(user => {
      Post.find({ $and: [{ category: 'GENERAL' }, { owner: user._id }, { post_id_ref: 'main' }] }).then(posts => {
        res.render('profiles/my_profile', { user, posts })
      })
    })
    .catch(err => next(err))
})

// My Profile - Team_Posts
router.get('/posts/:team', isLoggedIn, (req, res, next) => {
  const { currentUser: user } = req.session

  User.findById(user._id)
    .then(user => {
      Post.find({ $and: [{ category: user.team }, { owner: user._id }, { post_id_ref: 'main' }] }).then(posts => {
        res.render('profiles/my_profile-team_posts', { user, posts })
      })
    })
    .catch(err => next(err))
})

// My Profile - Favs
router.get('/favs', isLoggedIn, (req, res, next) => {
  const { currentUser: user } = req.session

  User.findById(user._id)
    .populate('favoritePosts')
    .then(user => res.render('profiles/my_profile-favs', { user }))
    .catch(err => next(err))
})

// My Profile - Edit
router.get('/edit', isLoggedIn, (req, res, next) => {
  const { currentUser: user } = req.session

  User.findById(user._id)
    .then(user => res.render('profiles/my_profile-edit', { user }))
    .catch(err => next(err))
})

router.post('/edit', isLoggedIn, (req, res, next) => {
  const { currentUser: user } = req.session
  const { bio, avatar } = req.body

  User.findByIdAndUpdate(user._id, { bio, avatar })
    .then(() => res.redirect('/profile'))
    .catch(err => next(err))
})

// My Profile - Select Team

router.get('/select-team', isLoggedIn, (req, res, next) => {
  const { currentUser: user } = req.session
  let hasNoTeam = user.team === 'NONE'

  User.findById(user._id)
    .then(user => {
      if (hasNoTeam) {
        res.render('profiles/my_profile-select_team', { user })
      }
    })
    .catch(err => next(err))
})

router.post('/select-team', isLoggedIn, (req, res, next) => {
  const { currentUser: user } = req.session
  const { team } = req.body

  User.findByIdAndUpdate(user._id, { team })
    .then(() => res.redirect('/'))
    .catch(err => next(err))
})

module.exports = router
