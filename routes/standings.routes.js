const router = require('express').Router()
const f1Api = require('../services/f1.service')

// Select Standings
router.get('/', (req, res, next) => {
  res.render('standings/select')
})

// Drivers Standings
router.get('/drivers', (req, res, next) => {
  f1Api
    .getAllDriversStandings()
    .then(responseFromAPI => {
      const { DriverStandings: drivers } = responseFromAPI.data.MRData.StandingsTable.StandingsLists[0]

      res.render('standings/drivers', { drivers })
    })
    .catch(err => next(err))
})

// Teams Standings
router.get('/teams', (req, res, next) => {
  f1Api
    .getAllTeamsStandings()
    .then(responseFromAPI => {
      const { ConstructorStandings: teams } = responseFromAPI.data.MRData.StandingsTable.StandingsLists[0]

      res.render('standings/teams', { teams })
    })
    .catch(err => next(err))
})

module.exports = router
