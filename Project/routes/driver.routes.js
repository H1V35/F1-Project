const router = require("express").Router();
const { response } = require("express");
const f1Api = require('../services/f1.service')

router.get('/details/:id', (req, res, next) => {
    const { id: driverId } = req.params
    f1Api
        .getOneDriver(driverId)
        .then(response => {
            res.send({ driver: response.data })
        })
        .catch(err => console.log(err))
})



module.exports = router