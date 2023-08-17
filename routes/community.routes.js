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
router.get('/GENERAL', (req, res, next) => {
  Post.find({ $and: [{ category: 'GENERAL' }, { post_id_ref: 'main' }] })
    .populate('owner')
    .then(posts => {
      res.render('community/general', { posts })
    })
    .catch(err => console.log(err))
})

// General - New Post
router.get('/GENERAL/new-post', (req, res, next) => res.render('community/new-post'))

router.post('/GENERAL/new-post', (req, res, next) => {
  const { title, text } = req.body
  const { _id: owner } = req.session.currentUser

  Post.create({ owner, title, text })
    .then(() => res.redirect('/community/GENERAL'))
    .catch(error => next(error))
})

// General - View Post
router.get('/GENERAL/post/:id', (req, res, next) => {
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

router.post('/GENERAL/post/:id', (req, res, next) => {
  const { id: post_id } = req.params
  const { _id: currentUser_id } = req.session.currentUser
  let isFav

  User.findById(currentUser_id).then(user => {
    isFav = user.favoritePosts.includes(post_id) ? true : false

    if (isFav) {
      User.findByIdAndUpdate(currentUser_id, { $pull: { favoritePosts: post_id } })
        .then(() => res.redirect(`/community/GENERAL/post/${post_id}`))
        .catch(err => next(err))
    } else {
      User.findByIdAndUpdate(currentUser_id, { $addToSet: { favoritePosts: post_id } })
        .then(() => res.redirect(`/community/GENERAL/post/${post_id}`))
        .catch(err => next(err))
    }
  })
})

// General - View Post - New Reply
router.get('/GENERAL/post/:id/new-reply', (req, res, next) => {
  const { id } = req.params

  Post.findById(id).then(main_post => res.render('community/new-reply', main_post))
})

router.post('/GENERAL/post/:id/new-reply', (req, res, next) => {
  const { id: post_id_ref } = req.params
  const { title, text } = req.body
  const { _id: owner } = req.session.currentUser

  Post.create({ owner, title, text, post_id_ref })
    .then(() => res.redirect(`/community/GENERAL/post/${post_id_ref}`))
    .catch(error => next(error))
})

// Team
router.get('/:team', (req, res, next) => {
  const { team } = req.params
  const { team: user_team } = req.session.currentUser

  if (team === user_team) {
    Post.find({ $and: [{ category: team }, { post_id_ref: 'main' }] })
      .populate('owner')
      .then(posts => {
        res.render('community/team', { posts })
      })
      .catch(err => console.log(err))
  } else {
    res.redirect(`/community/${user_team}`)
  }
})

// Team - New Post
router.get('/:team/new-post', (req, res, next) => res.render('community/team-new-post'))

router.post('/:team/new-post', (req, res, next) => {
  const { title, text } = req.body
  const { _id: owner, team: category } = req.session.currentUser

  Post.create({ category, owner, title, text })
    .then(() => res.redirect(`/community/${category}`))
    .catch(error => next(error))
})

// Team - View Post
router.get('/:team/post/:id', (req, res, next) => {
  const { id: post_id } = req.params
  const { _id: currentUser_id } = req.session.currentUser
  let isFav

  User.findById(currentUser_id).then(user => {
    isFav = user.favoritePosts.includes(post_id) ? true : false
  })

  Post.find({ $or: [{ _id: post_id }, { post_id_ref: post_id }] })
    .populate('owner')
    .then(posts => res.render('community/team-post', { posts, isFav }))
})

router.post('/:team/post/:id', (req, res, next) => {
  const { id: post_id } = req.params
  const { _id: currentUser_id } = req.session.currentUser
  let isFav

  User.findById(currentUser_id).then(user => {
    isFav = user.favoritePosts.includes(post_id) ? true : false

    if (isFav) {
      User.findByIdAndUpdate(currentUser_id, { $pull: { favoritePosts: post_id } })
        .then(() => res.redirect(`/community/${user.team}/post/${post_id}`))
        .catch(err => next(err))
    } else {
      User.findByIdAndUpdate(currentUser_id, { $addToSet: { favoritePosts: post_id } })
        .then(() => res.redirect(`/community/${user.team}/post/${post_id}`))
        .catch(err => next(err))
    }
  })
})

//Team - View Post - New Reply
router.get('/:team/post/:id/new-reply', (req, res, next) => {
  const { id: post_id } = req.params

  Post.findById(post_id).then(main_post => res.render('community/team-new-reply', main_post))
})

router.post('/:team/post/:id/new-reply', (req, res, next) => {
  const { id: post_id_ref } = req.params
  const { title, text } = req.body
  const { _id: owner, team: category } = req.session.currentUser

  Post.create({ category, owner, title, text, post_id_ref })
    .then(() => res.redirect(`/community/${category}/post/${post_id_ref}`))
    .catch(error => next(error))
})

module.exports = router
