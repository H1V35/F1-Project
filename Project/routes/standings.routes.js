const router = require('express').Router()
const f1Api = require('../services/f1.service')

router.get('/', (req, res, next) => {
  res.render('standings/select', { user: req.session.currentUser })
})

router.get('/drivers', (req, res, next) => {
  f1Api
    .getAllDriversStandings()
    .then(responseFromAPI => {
      res.render('standings/drivers', { drivers: responseFromAPI.data.MRData.StandingsTable.StandingsLists[0].DriverStandings })
    })
    .catch(err => console.log(err))
})

router.get('/teams', (req, res, next) => {
  f1Api
    .getAllTeamsStandings()
    .then(responseFromAPI => {
      res.render('standings/teams', { teams: responseFromAPI.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings })
    })
    .catch(err => console.log(err))
})

module.exports = router
