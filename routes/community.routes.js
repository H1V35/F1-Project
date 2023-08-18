const router = require('express').Router()
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const User = require('../models/User.model')
const Post = require('../models/Post.model')

// General
router.get('/GENERAL', isLoggedIn, (req, res, next) => {
  const { currentUser: user } = req.session

  User.findById(user._id).then(user => {
    let hasNoTeam = user.team === 'NONE'

    Post.find({ $and: [{ category: 'GENERAL' }, { post_id_ref: 'main' }] })
      .populate('owner')
      .then(posts => {
        res.render('community/general', { user, posts, hasNoTeam })
      })
      .catch(err => next(err))
  })
})

// General - New Post
router.get('/GENERAL/new-post', isLoggedIn, (req, res, next) => res.render('community/new-post'))

router.post('/GENERAL/new-post', isLoggedIn, (req, res, next) => {
  const { title, text } = req.body
  const { _id: owner } = req.session.currentUser

  Post.create({ owner, title, text })
    .then(() => res.redirect('/community/GENERAL'))
    .catch(error => next(error))
})

// General - View Post
router.get('/GENERAL/post/:id', isLoggedIn, (req, res, next) => {
  const { id: post_id } = req.params
  const { _id: currentUser_id } = req.session.currentUser
  const userRoles = {
    isADMIN: req.session.currentUser?.role === 'ADMIN'
  }

  User.findById(currentUser_id).then(user => {
    let isFav = user.favoritePosts.includes(post_id)
    let hasNoTeam = user.team === 'NONE'

    Post.find({ $or: [{ _id: post_id }, { post_id_ref: post_id }] })
      .populate('owner')
      .then(posts => res.render('community/general-post', { userRoles, user, posts, isFav, hasNoTeam }))
      .catch(err => next(err))
  })
})

router.post('/GENERAL/post/:id', isLoggedIn, (req, res, next) => {
  const { id: post_id } = req.params
  const { _id: currentUser_id } = req.session.currentUser
  let isFav

  User.findById(currentUser_id).then(user => {
    isFav = user.favoritePosts.includes(post_id)

    let query = isFav ? { $pull: { favoritePosts: post_id } } : { $addToSet: { favoritePosts: post_id } }

    User.findByIdAndUpdate(currentUser_id, query)
      .then(() => res.redirect(`/community/GENERAL/post/${post_id}`))
      .catch(err => next(err))
  })
})

// General - Edit Post
router.get('/GENERAL/post/:id/edit', isLoggedIn, checkRoles('ADMIN'), (req, res, next) => {
  const { id: post_id } = req.params

  Post.findById(post_id)
    .then(post => res.render('community/edit-post', post))
    .catch(err => next(err))
})

router.post('/GENERAL/post/:id/edit', isLoggedIn, checkRoles('ADMIN'), (req, res, next) => {
  const { id: post_id } = req.params
  const { title, text } = req.body

  Post.findByIdAndUpdate(post_id, { title, text })
    .then(() => res.redirect('/community/GENERAL'))
    .catch(err => next(err))
})

// General - Delete Post
router.post('/GENERAL/post/:id/delete', isLoggedIn, checkRoles('ADMIN'), (req, res, next) => {
  const { id: post_id } = req.params

  Post.findByIdAndDelete(post_id)
    .then(() => res.redirect('/community/GENERAL'))
    .catch(err => next(err))
})

// General - View Post - New Reply
router.get('/GENERAL/post/:id/new-reply', isLoggedIn, (req, res, next) => {
  const { id } = req.params

  Post.findById(id)
    .then(main_post => res.render('community/new-reply', main_post))
    .catch(err => next(err))
})

router.post('/GENERAL/post/:id/new-reply', isLoggedIn, (req, res, next) => {
  const { id: post_id_ref } = req.params
  const { title, text } = req.body
  const { _id: owner } = req.session.currentUser

  Post.create({ owner, title, text, post_id_ref })
    .then(() => res.redirect(`/community/GENERAL/post/${post_id_ref}`))
    .catch(error => next(error))
})

// Team
router.get('/:team', isLoggedIn, (req, res, next) => {
  const { team } = req.params
  const { currentUser: user } = req.session

  User.findById(user._id).then(user => {
    let hasNoTeam = user.team === 'NONE'

    if (team === user.team) {
      Post.find({ $and: [{ category: team }, { post_id_ref: 'main' }] })
        .populate('owner')
        .then(posts => {
          res.render('community/team', { user, posts, hasNoTeam })
        })
        .catch(err => next(err))
    } else {
      res.redirect(`/community/${user.team}`)
    }
  })
})

// Team - New Post
router.get('/:team/new-post', isLoggedIn, (req, res, next) => res.render('community/team-new-post'))

router.post('/:team/new-post', isLoggedIn, (req, res, next) => {
  const { title, text } = req.body
  const { _id: owner, team: category } = req.session.currentUser

  Post.create({ category, owner, title, text })
    .then(() => res.redirect(`/community/${category}`))
    .catch(error => next(error))
})

// Team - View Post
router.get('/:team/post/:id', isLoggedIn, (req, res, next) => {
  const { id: post_id } = req.params
  const { _id: currentUser_id } = req.session.currentUser
  const userRoles = {
    isADMIN: req.session.currentUser?.role === 'ADMIN'
  }
  let isFav

  User.findById(currentUser_id).then(user => {
    isFav = user.favoritePosts.includes(post_id)
    let hasNoTeam = user.team === 'NONE'

    Post.find({ $or: [{ _id: post_id }, { post_id_ref: post_id }] })
      .populate('owner')
      .then(posts => res.render('community/team-post', { userRoles, user, posts, isFav, hasNoTeam }))
  })
})

router.post('/:team/post/:id', isLoggedIn, (req, res, next) => {
  const { id: post_id } = req.params
  const { _id: currentUser_id } = req.session.currentUser
  let isFav

  User.findById(currentUser_id).then(user => {
    isFav = user.favoritePosts.includes(post_id)

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

// Team - Edit Post
router.get('/:team/post/:id/edit', isLoggedIn, checkRoles('ADMIN'), (req, res, next) => {
  const { id: post_id } = req.params

  Post.findById(post_id)
    .then(post => res.render('community/team-edit-post', post))
    .catch(err => next(err))
})

router.post('/:team/post/:id/edit', isLoggedIn, checkRoles('ADMIN'), (req, res, next) => {
  const { currentUser: user } = req.session
  const { id: post_id } = req.params
  const { title, text } = req.body

  Post.findByIdAndUpdate(post_id, { title, text })
    .then(() => res.redirect(`/community/${user.team}`))
    .catch(err => next(err))
})

// Team - Delete Post
router.post('/:team/post/:id/delete', isLoggedIn, checkRoles('ADMIN'), (req, res, next) => {
  const { currentUser: user } = req.session
  const { id: post_id } = req.params

  Post.findByIdAndDelete(post_id)
    .then(() => res.redirect(`/community/${user.team}`))
    .catch(err => next(err))
})

// Team - View Post - New Reply
router.get('/:team/post/:id/new-reply', isLoggedIn, (req, res, next) => {
  const { id: post_id } = req.params

  Post.findById(post_id)
    .then(main_post => res.render('community/team-new-reply', main_post))
    .catch(err => next(err))
})

router.post('/:team/post/:id/new-reply', isLoggedIn, (req, res, next) => {
  const { id: post_id_ref } = req.params
  const { title, text } = req.body
  const { _id: owner, team: category } = req.session.currentUser

  Post.create({ category, owner, title, text, post_id_ref })
    .then(() => res.redirect(`/community/${category}/post/${post_id_ref}`))
    .catch(error => next(error))
})

module.exports = router
