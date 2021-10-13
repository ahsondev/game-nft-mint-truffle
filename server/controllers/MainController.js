const { body: bodyCheck } = require('express-validator')

async function index(req, res) {
  await bodyCheck('uid').notEmpty().run(req)
  await bodyCheck('name').notEmpty().run(req)
  await bodyCheck('email').isEmail().run(req)
  await bodyCheck('password').notEmpty().run(req)

  res.json({ a: 1 })
}

module.exports = {
  index,
}
