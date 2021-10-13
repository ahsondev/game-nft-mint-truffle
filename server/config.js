const config = require('dotenv-flow').config().parsed

module.exports = {
  ...config,
  PORT: 4000
}
