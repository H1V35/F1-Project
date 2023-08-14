const router = require('express').Router()
const f1Api = require('../services/f1.service')

router.get('/:driverId/details', (req, res, next) => {
  const { driverId } = req.params
  f1Api
    .getOneDriver(driverId)
    .then(responseFromAPI => {
      console.log(responseFromAPI)
      res.send(responseFromAPI.data)
    })
    .catch(err => console.log(err))
})

module.exports = router
