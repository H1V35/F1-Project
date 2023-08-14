const router = require('express').Router()
const f1Api = require('../services/f1.service')

router.get('/details/:id', (req, res, next) => {
  const { id: driver_Id } = req.params
  f1Api
    .getOneDriver(driver_Id)
    .then(responseFromAPI => {
      res.send({ driver: responseFromAPI.data })
    })
    .catch(err => console.log(err))
})

module.exports = router
