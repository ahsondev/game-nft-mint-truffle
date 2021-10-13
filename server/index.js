const config = require('./config')
const express = require('./services/express')
const routes = require('./routes')

const port = config.PORT || 4000
// const port = parseInt(config.PORT, 10) || 3000
const app = express(routes)

app.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})
