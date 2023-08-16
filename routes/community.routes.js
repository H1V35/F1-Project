const router = require('express').Router()
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const User = require('../models/User.model')
const Post = require('../models/Post.model')

// Users List
router.get('/users', (req, res, next) => {
  User.find()
    .then(users => {
      res.render('community/users', { users })
    })
    .catch(err => console.log(err))
})

// General
router.get('/', (req, res, next) => {
  Post.find({ $and: [{ category: 'GENERAL' }, { post_id_ref: 'main' }] })
    .populate('owner')
    .then(posts => {
      res.render('community/general', { posts })
    })
    .catch(err => console.log(err))
})

// General - New Post
router.get('/new-post', (req, res, next) => res.render('community/new-post'))

router.post('/new-post', (req, res, next) => {
  const { title, text } = req.body
  const { _id: owner } = req.session.currentUser

  Post.create({ owner, title, text })
    .then(() => res.redirect('/community'))
    .catch(error => next(error))
})

// General - View Post
router.get('/post/:id', (req, res, next) => {
  const { id: post_id } = req.params
  const { _id: currentUser_id } = req.session.currentUser
  let isFav

  User.findById(currentUser_id).then(user => {
    isFav = user.favoritePosts.includes(post_id) ? true : false
  })

  Post.find({ $or: [{ _id: post_id }, { post_id_ref: post_id }] })
    .populate('owner')
    .then(posts => res.render('community/general-post', { posts, isFav }))
})

router.post('/post/:id', (req, res, next) => {
  const { id: post_id } = req.params
  const { _id: currentUser_id } = req.session.currentUser
  let isFav

  User.findById(currentUser_id).then(user => {
    isFav = user.favoritePosts.includes(post_id) ? true : false

    if (isFav) {
      User.findByIdAndUpdate(currentUser_id, { $pull: { favoritePosts: post_id } })
        .then(() => res.redirect(`/community/post/${post_id}`))
        .catch(err => next(err))
    } else {
      User.findByIdAndUpdate(currentUser_id, { $addToSet: { favoritePosts: post_id } })
        .then(() => res.redirect(`/community/post/${post_id}`))
        .catch(err => next(err))
    }
  })
})

// General - Post - New Reply
router.get('/post/:id/new-reply', (req, res, next) => {
  const { id } = req.params

  Post.findById(id).then(main_post => res.render('community/new-reply', main_post))
})

router.post('/post/:id/new-reply', (req, res, next) => {
  const { id: post_id_ref } = req.params
  const { title, text, number_order } = req.body
  const { _id: owner } = req.session.currentUser

  Post.create({ owner, title, text, post_id_ref })
    .then(() => res.redirect(`/community/post/${post_id_ref}`))
    .catch(error => next(error))
})

// Team
router.get('/:team', (req, res, next) => {
  const { team } = req.params
  const { team: user_team } = req.session.currentUser

  if (team === user_team) {
    Post.find({ team })
      .populate('owner')
      .then(posts => {
        res.render('community/team', { posts })
      })
      .catch(err => console.log(err))
  } else {
    res.redirect(`/community/${user_team}`)
  }
})

module.exports = router
