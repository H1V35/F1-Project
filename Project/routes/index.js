module.exports = app => {
  const indexRoutes = require('./index.routes')
  app.use('/', indexRoutes)

  const authRouter = require('./auth.routes')
  app.use('/', authRouter)

  //   const placesRoutes = require('./places.routes')
  //   app.use('/places', placesRoutes)

  //   const apiRoutes = require('./api.routes')
  //   app.use('/api', apiRoutes)
}
