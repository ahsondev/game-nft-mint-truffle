const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

router.post('/index', Controllers.Main.subscribeSendgridEmail)

module.exports = router
