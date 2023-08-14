const router = require('express').Router()
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const User = require('../models/User.model')
const Post = require('../models/Post.model')

router.get('/', (req, res, next) => {
  Post.find({ team: 'GENERAL' })
    .then(posts => {
      res.render('community/general', { posts })
    })
    .catch(err => console.log(err))
})

router.get('/:team', (req, res, next) => {
  const { team } = req.params

  Post.find({ team })
    .then(posts => {
      res.render('community/team', { posts })
    })
    .catch(err => console.log(err))
})

module.exports = router
