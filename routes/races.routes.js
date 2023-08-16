const router = require('express').Router()
const f1Api = require('../services/f1.service')

// Races Schedule
router.get('/schedule', (req, res, next) => {
  f1Api
    .getAllRaces()
    .then(responseFromAPI => {
      const allRaces = responseFromAPI.data.MRData.RaceTable.Races

      const currentDate = new Date()
      const newRaces = allRaces.filter(race => new Date(race.date) > currentDate)
      const oldRaces = allRaces.filter(race => new Date(race.date) < currentDate).reverse()

      const locations = allRaces.map(race => race.Circuit.Location)

      res.render('races/schedule', { newRaces, oldRaces, locations })
    })
    .catch(err => console.log(err))
})

module.exports = router
