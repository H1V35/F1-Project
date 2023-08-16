const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next()
  } else {
    res.redirect('/log-in')
  }
}

// const isLoggedOut = (req, res, next) => {
//   if (!req.session.currentUser) {
//     next()
//   } else {
//     res.redirect('/')
//   }
// }

const updateLoggedUser = (req, res, next) => {
  res.locals.loggedUser = req.session.currentUser
  //   res.locals.userIsAdmin = req.session.currentUser?.role === 'ADMIN'
  //   res.locals.userIsEditor = req.session.currentUser?.role === 'USER_PREMIUM'
  //   res.locals.userIsBasic = req.session.currentUser?.role === 'USER'
  next()
}

const checkRoles =
  (...admittedRoles) =>
  (req, res, next) => {
    const { role } = req.session.currentUser

    if (admittedRoles.includes(role)) {
      next()
    } else {
      console.log('----- Not Authorized -----')
      res.redirect('/log-in?err=Not Authorized')
    }
  }

const checkTeam = userTeam => (req, res, next) => {
  const { team } = req.session.currentUser

  if (userTeam === team) {
    next()
  } else {
    console.log('----- Not yout team -----')
    res.redirect('/log-in?err=Not your team')
  }
}

module.exports = {
  isLoggedIn,
  //   isLoggedOut,
  updateLoggedUser,
  checkRoles,
  checkTeam
}
