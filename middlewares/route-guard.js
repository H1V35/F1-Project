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

const checkAdmin = userRole => (req, res, next) => {
  const { admin } = req.session.currentUser.role
  if (userRole === admin) {
    next()
  } else {
    console.log('------NOT ADMIN------')
    res.redirect('/log-in?err=Not Admin')
  }
}

const isOwnerOrAdmin = userRole => (req, res, next) => {
  const { owner } = req.session.owner.currentUser
  if (checkAdmin === admin || userRole === owner) {
    next()
  } else {
    console.log('-----NOT--OWNER-or-Admin-----')
    res.redirect('/log-in?err=Not Admin')
  }
}


module.exports = {
  isLoggedIn,
  //   isLoggedOut,
  checkRoles,
  checkTeam,
  checkAdmin,
  isOwnerOrAdmin
}
