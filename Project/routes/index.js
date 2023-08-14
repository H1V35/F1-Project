module.exports = app => {
  const indexRoutes = require('./index.routes')
  app.use('/', indexRoutes)

  const authRouter = require('./auth.routes')
  app.use('/', authRouter)

  const racesRoutes = require('./races.routes')
  app.use('/races', racesRoutes)

  const standingRoutes = require('./standings.routes')
  app.use('/standings', standingRoutes)

  const driverRoutes = require('./driver.routes')
  app.use('/driver', driverRoutes)

  const teamRoutes = require('./team.routes')
  app.use('/team', teamRoutes)

  const communityRoutes = require('./community.routes')
  app.use('/community', communityRoutes)

  //   const apiRoutes = require('./api.routes')
  //   app.use('/api', apiRoutes)
}
