const S = require('fluent-schema')
const queries = require('./queries')

const bodySchema = S.object()
  .prop('doctype', S.string()).required()
  .prop('title', S.string()).required()
  .prop('excerpt', S.string()).default('')
  .prop('body', S.string()).default('')
  .prop('metadata', S.anyOf([S, S.null()])).default(null)
  .prop('content', S.anyOf([S, S.null()])).default(null)

module.exports = function (fastify, opts, next) {
  fastify.route({
    url: '/document-relationships',
    method: 'GET',
    handler: async (request) => {
      const client = await fastify.pg.connect()
      const relationships = await client.query(queries.relationships())
      client.release()
      return relationships.rows
    }
  })

  fastify.route({
    url: '/document',
    method: 'POST',
    schema: {
      body: bodySchema
    },
    handler: async (request) => {
      const client = await fastify.pg.connect()
      const created = await client.query(queries.create(request.body))
      client.release()
      return created
    }
  })

  fastify.route({
    url: '/document',
    method: 'GET',
    schema: {
      response: {
        200: S.object().prop('data',
          S.array().items(bodySchema.prop('id', S.number()))
        )
      }
    },
    handler: async (request) => {
      const client = await fastify.pg.connect()
      let docs = { rows: [] }
      const {
        filter = [],
        find,
        pg,
        limit,
        match,
        type
      } = request.query

      const filterArray = Array.isArray(filter) ? filter : filter.split(',')
      docs = await client.query(queries.list({
        filter: filterArray,
        find,
        pg,
        limit,
        match,
        type
      }))
      client.release()

      return {
        data: docs.rows
      }
    }
  })

  next()
}
