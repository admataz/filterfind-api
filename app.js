
// const AutoLo ad = require('fastify-autoload')

const {
  PGHOST,
  PGPORT,
  PGUSER,
  PGPASSWORD,
  PGDATABASE
} = process.env

module.exports = function (fastify, opts, next) {
  // Place here your custom code!
  fastify.register(require('fastify-cors'), {
    origin: '*'
  })
  fastify.register(require('fastify-postgres'), {
    connectionString: `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`
  })

  fastify.register(require('fastify-sensible'))
  // fastify.register(require('./services/health'), { prefix: '/api' })
  fastify.register(require('./services/document'), {
    prefix: '/api'
  })
  next()
}
