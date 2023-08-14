const router = require('express').Router()
const f1Api = require('../services/f1.service')

router.get('/details/:id', (req, res, next) => {
  const { id: team_Id } = req.params
  f1Api
    .getOneTeam(team_Id)
    .then(responseFromAPI => {
      res.send({ team: responseFromAPI.data })
    })
    .catch(err => console.log(err))
})

module.exports = router
