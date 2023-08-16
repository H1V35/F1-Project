const router = require('express').Router()
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const User = require('../models/User.model')
const Post = require('../models/Post.model')

router.get('/', (req, res, next) => {
  Post.find({ $and: [{ category: 'GENERAL' }, { post_id_ref: 'main' }] })
    .then(posts => {
      res.render('community/general', { posts })
    })
    .catch(err => console.log(err))
})

router.get('/users', (req, res, next) => {
  User.find()
    .then(users => {
      res.render('community/users', { users })
    })
    .catch(err => console.log(err))
})

router.get('/new-post', (req, res, next) => res.render('community/new-post'))

router.post('/new-post', (req, res, next) => {
  const { title, text } = req.body
  const { _id: owner } = req.session.currentUser

  Post.create({ owner, title, text })
    .then(() => res.redirect('/community'))
    .catch(error => next(error))
})

router.get('/post/:id', (req, res, next) => {
  const { id } = req.params

  Post.find({ $or: [{ _id: id }, { post_id_ref: id }] }).then(posts => res.render('community/general-post', { posts }))
})

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

router.get('/:team', (req, res, next) => {
  const { team } = req.params
  const { team: user_team } = req.session.currentUser

  if (team === user_team) {
    Post.find({ team })
      .then(posts => {
        res.render('community/team', { posts })
      })
      .catch(err => console.log(err))
  } else {
    res.redirect(`/community/${user_team}`)
  }
})

module.exports = router
