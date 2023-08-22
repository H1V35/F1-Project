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
    const { role } = req.session.currentUser
    console.log(role)

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
