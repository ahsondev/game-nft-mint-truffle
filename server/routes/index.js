const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

router.post('/index', Controllers.Main.index)

module.exports = router;
