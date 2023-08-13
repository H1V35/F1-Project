const router = require("express").Router();
const { response } = require("express");
const f1Api = require('../services/f1.service')

router.get('/details/:id', (req, res, next) => {
    const { id: teamId } = req.params
    f1Api
        .getOneTeam(teamId)
        .then(response => {
            res.send({ team: response.data })
        })
        .catch(err => console.log(err))
})



module.exports = router