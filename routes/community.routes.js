const router = require('express').Router()
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const User = require('../models/User.model')
const Post = require('../models/Post.model')

// CHANGE USERS TO NEW ROUTES GROUP
// Users List
router.get('/users', (req, res, next) => {
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
router.get('/user/:username', (req, res, next) => {
  const { username } = req.params

  User.findOne({ username })
    .then(user => {
      let hasNoTeam = user.team === 'NONE'

      Post.find({ $and: [{ category: 'GENERAL' }, { owner: user._id }, { post_id_ref: 'main' }] })
        .then(posts => {
          res.render('community/user-profile', { user, posts, hasNoTeam })
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

// Users - View User - Team_Posts
router.get('/user/:username/posts/:team', (req, res, next) => {
  const { username } = req.params

  User.findOne({ username }).then(user => {
    let hasNoTeam = user.team === 'NONE'

    Post.find({ $and: [{ category: user.team }, { owner: user._id }, { post_id_ref: 'main' }] })
      .then(posts => {
        res.render('community/user-team_posts', { user, posts, hasNoTeam })
      })
      .catch(err => next(err))
  })
})

// Users - Edit User
router.get('/user/:username/edit', (req, res, next) => {
  const { username } = req.params

  User.findOne({ username })
    .then(user => {
      let hasNoTeam = user.team === 'NONE'

      Post.find({ $and: [{ category: 'GENERAL' }, { owner: user._id }, { post_id_ref: 'main' }] })
        .then(posts => {
          res.render('community/user-profile', { user, posts, hasNoTeam })
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
})

// General
router.get('/GENERAL', (req, res, next) => {
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

  User.findById(currentUser_id).then(user => {
    let isFav = user.favoritePosts.includes(post_id)
    let hasNoTeam = user.team === 'NONE'

    Post.find({ $or: [{ _id: post_id }, { post_id_ref: post_id }] })
      .populate('owner')
      .then(posts => res.render('community/general-post', { user, posts, isFav, hasNoTeam }))
      .catch(err => next(err))
  })
})

router.post('/GENERAL/post/:id', (req, res, next) => {
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

// General - View Post - New Reply
router.get('/GENERAL/post/:id/new-reply', (req, res, next) => {
  const { id } = req.params

  Post.findById(id)
    .then(main_post => res.render('community/new-reply', main_post))
    .catch(err => next(err))
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
    isFav = user.favoritePosts.includes(post_id)
    let hasNoTeam = user.team === 'NONE'

    Post.find({ $or: [{ _id: post_id }, { post_id_ref: post_id }] })
      .populate('owner')
      .then(posts => res.render('community/team-post', { user, posts, isFav, hasNoTeam }))
  })
})

router.post('/:team/post/:id', (req, res, next) => {
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

//Team - View Post - New Reply
router.get('/:team/post/:id/new-reply', (req, res, next) => {
  const { id: post_id } = req.params

  Post.findById(post_id)
    .then(main_post => res.render('community/team-new-reply', main_post))
    .catch(err => next(err))
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
