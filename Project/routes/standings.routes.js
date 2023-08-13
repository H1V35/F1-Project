const router = require("express").Router();
const { response } = require("express");
const f1Api = require('../services/f1.service')

router.get('/driver', (req, res, next) => {
    f1Api
        .getAllDriversStandings()
        .then(response => {
            res.send(response.data)
        })
        .catch(err => console.log(err))
})

router.get('/teams', (req, res, next) => {
    f1Api
        .getAllTeamsStandings()
        .then(response => {
            res.send(response.data)
        })
        .catch(err => console.log(err))
})


module.exports = router