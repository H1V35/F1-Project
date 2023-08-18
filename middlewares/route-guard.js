const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next()
  } else {
    res.redirect('/log-in')
  }
}

const checkRoles =
  (...admittedRoles) =>
  (req, res, next) => {
    const { currentUser: role } = req.session

    if (admittedRoles.includes(role)) {
      next()
    } else {
      res.redirect('/log-in?err=Not Authorized')
    }
  }

module.exports = {
  isLoggedIn,
  checkRoles
}
