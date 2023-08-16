require('dotenv').config()

require('./db')

const express = require('express')
const hbs = require('hbs')
const { updateLoggedUser } = require('./middlewares/route-guard')
const app = express()

require('./config')(app)
require('./config/session.config')(app)

app.locals.appTitle = 'F1-Project'
app.use(updateLoggedUser)

require('./routes')(app)
require('./error-handling')(app)

module.exports = app
