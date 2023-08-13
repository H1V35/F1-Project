const router = require("express").Router();
const { response } = require("express");
const f1Api = require('../services/f1.service')

router.get('/schedule', (req, res, next) => {
    f1Api
        .getAllRaces()
        .then(response => {
            res.send(response.data)
        })
        .catch(err => console.log(err))
})

router.get('/results', (req, res, next) => {
    f1Api
        .getAllResults()
        .then(results => {
            res.send(results.data)
        })
        .catch(err => console.log(err))
})

module.exports = router