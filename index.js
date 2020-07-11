const fastify = require('fastify')({ logger: true })
const app = require('./app')

fastify.register(app)

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
