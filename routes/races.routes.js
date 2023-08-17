const router = require('express').Router()
const f1Api = require('../services/f1.service')

// Races Schedule
router.get('/schedule', (req, res, next) => {
  f1Api
    .getAllRaces()
    .then(responseFromAPI => {
      const { Races } = responseFromAPI.data.MRData.RaceTable

      const currentDate = new Date()

      const newRaces = Races.filter(race => new Date(race.date) > currentDate)
      const oldRaces = Races.filter(race => new Date(race.date) < currentDate).reverse()
      const locations = Races.map(race => race.Circuit.Location)

      res.render('races/schedule', { newRaces, oldRaces, locations })
    })
    .catch(err => next(err))
})

module.exports = router
