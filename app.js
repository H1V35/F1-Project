require('dotenv').config()

require('./db')

const express = require('express')
const app = express()

require('./config')(app)
require('./config/session.config')(app)

app.locals.appTitle = 'F1-Project'

const { updateLoggedUser } = require('./middlewares/user-updater')
app.use(updateLoggedUser)

require('./routes')(app)
require('./error-handling')(app)

module.exports = app
