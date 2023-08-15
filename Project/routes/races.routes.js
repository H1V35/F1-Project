const router = require('express').Router()
const f1Api = require('../services/f1.service')

router.get('/schedule', (req, res, next) => {
    f1Api
        .getAllRaces()
        .then(newRacesFromAPI => {
            const allRaces = newRacesFromAPI.data.MRData.RaceTable.Races;
            const currentDate = new Date();
            const newRaces = allRaces.filter(race => new Date(race.date) > currentDate);
            const oldRaces = allRaces.filter(race => new Date(race.date) < currentDate).reverse();
            const locations = allRaces.map(race => race.Circuit.Location);
            res.render('races/schedule', { new_races: newRaces, old_races: oldRaces, locations: locations })
        })
        .catch(err => console.log(err))
})

module.exports = router
