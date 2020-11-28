const mercurius = require('mercurius')
const documentGql = require('./gql/document')

const {
  PGHOST,
  PGPORT,
  PGUSER,
  PGPASSWORD,
  PGDATABASE
} = process.env

module.exports = function (fastify, opts, next) {
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

  fastify.register(mercurius, { ...documentGql, graphiql: true })
  next()
}
