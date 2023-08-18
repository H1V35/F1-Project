const router = require('express').Router()
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const User = require('../models/User.model')
const Post = require('../models/Post.model')

// Users List
router.get('/list', isLoggedIn, (req, res, next) => {
  const { currentUser: user } = req.session

  User.findById(user._id).then(user => {
    let hasNoTeam = user.team === 'NONE'

    User.find()
      .then(users => {
        res.render('community/users', { user, users, hasNoTeam })
      })
      .catch(err => next(err))
  })
})

// Users - View User
router.get('/:username', isLoggedIn, (req, res, next) => {
  const { username } = req.params
  const userRoles = {
    isADMIN: req.session.currentUser?.role === 'ADMIN'
  }

  User.findOne({ username })
    .then(user => {
      let hasNoTeam = user.team === 'NONE'

      Post.find({ $and: [{ category: 'GENERAL' }, { owner: user._id }, { post_id_ref: 'main' }] })
        .then(posts => {
          res.render('community/user-profile', { userRoles, user, posts, hasNoTeam })
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

// Users - View User - Team_Posts
router.get('/:username/posts/:team', isLoggedIn, (req, res, next) => {
  const { username } = req.params
  const userRoles = {
    isADMIN: req.session.currentUser?.role === 'ADMIN'
  }

  User.findOne({ username }).then(user => {
    let hasNoTeam = user.team === 'NONE'

    Post.find({ $and: [{ category: user.team }, { owner: user._id }, { post_id_ref: 'main' }] })
      .then(posts => {
        res.render('community/user-team_posts', { userRoles, user, posts, hasNoTeam })
      })
      .catch(err => next(err))
  })
})

// Users - Delete User
router.post('/:username/delete', isLoggedIn, checkRoles('ADMIN'), (req, res, next) => {
  const { username } = req.params

  User.findOneAndDelete({ username })
    .then(() => res.redirect('/community/user/list'))
    .catch(err => next(err))
})

module.exports = router
