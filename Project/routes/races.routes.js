const router = require('express').Router()
const f1Api = require('../services/f1.service')

router.get('/schedule', (req, res, next) => {
    f1Api
        .getAllRaces()
        .then(responseFromAPI => {
            res.render('races/schedule', { races: responseFromAPI.data.MRData.RaceTable.Races })
        })
        .catch(err => console.log(err))
})

router.get('/results', (req, res, next) => {
    f1Api
        .getAllResults()
        .then(responseFromAPI => {
            res.send(responseFromAPI.data)
        })
        .catch(err => console.log(err))
})

module.exports = router
