module.exports = app => {
  const indexRoutes = require('./index.routes')
  app.use('/', indexRoutes)

  const authRouter = require('./auth.routes')
  app.use('/', authRouter)

  const racesRoutes = require('./races.routes')
  app.use('/races', racesRoutes)

  const standingRoutes = require('./standings.routes')
  app.use('/standings', standingRoutes)

  const communityRoutes = require('./community.routes')
  app.use('/community', communityRoutes)

  const profilesRoutes = require('./profiles.routes')
  app.use('/profile', profilesRoutes)

  //   const apiRoutes = require('./api.routes')
  //   app.use('/api', apiRoutes)
}
