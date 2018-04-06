const app = require('../server')
const config = require('../config')
const spawn = require('cross-spawn')

const server = app.listen(process.env.PORT || config.dev.port, () => {
  const opts = ['--config', 'e2e/nightwatch.conf.js', '--env', 'chrome']
  const runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' })

  runner.on('exit', function (code) {
    server.close()
    process.exit(code)
  })

  runner.on('error', function (err) {
    server.close()
    throw err
  })
})
