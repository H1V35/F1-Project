const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

router.get('/sign-up', (req, res, next) => res.render('auth/signup'))
router.post('/sign-up', (req, res, next) => {
  const { username, email, userPwd, team, nick, bio, profileImg } = req.body

  if (!email.length) {
    res.render('auth/signup', { errorMessage: 'E-mail required' })
    return
  }

  User.findOne({ email }).then(foundUser => {
    if (foundUser) {
      res.render('auth/signup', { errorMessage: 'This e-mail alredy exists' })
      return
    }
  })

  if (username.length < 2 || username.length > 18) {
    res.render('auth/signup', { errorMessage: 'Username min 2 / 18 max characters' })
    return
  }

  User.findOne({ username }).then(foundUser => {
    if (foundUser) {
      res.render('auth/signup', { errorMessage: 'This username alredy exists' })
      return
    }
  })

  if (!userPwd.length) {
    res.render('auth/signup', { errorMessage: 'Password required' })
    return
  }

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(userPwd, salt))
    .then(hashedPassword => User.create({ username, email, password: hashedPassword, team, nick, bio, profileImg }))
    .then(createdUser => res.redirect('/'))
    .catch(error => next(error))
})

router.get('/log-in', (req, res, next) => res.render('auth/login'))
router.post('/log-in', (req, res, next) => {
  const { username, userPwd } = req.body

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'User not registered in the database' })
        return
      } else if (bcrypt.compareSync(userPwd, user.password) === false) {
        res.render('auth/login', { errorMessage: 'Incorrect Password' })
        return
      } else {
        req.session.currentUser = user
        res.redirect('/')
      }
    })
    .catch(error => next(error))
})

router.post('/log-out', (req, res, next) => {
  req.session.destroy(() => res.redirect('/'))
})

module.exports = router
