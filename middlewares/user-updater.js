const updateLoggedUser = (req, res, next) => {
  res.locals.loggedUser = req.session.currentUser
  //   res.locals.userIsAdmin = req.session.currentUser?.role === 'ADMIN'
  //   res.locals.userIsEditor = req.session.currentUser?.role === 'USER_PREMIUM'
  //   res.locals.userIsBasic = req.session.currentUser?.role === 'USER'
  next()
}

module.exports = { updateLoggedUser }
