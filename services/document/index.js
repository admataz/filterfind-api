const S = require('fluent-schema')
const queries = require('./queries')

const documentUpsertSchema = S.object()
  .prop('docschema', S.number())
  .prop('title', S.string())
  .prop('excerpt', S.string())
  .prop('body', S.string())
  .prop('metadata', S.anyOf([S, S.null()]))
  .prop('content', S.anyOf([S, S.null()]))
  .prop('related', S.anyOf([S.array().items(S.number()), S.null()]))

const documentReadSchema = documentUpsertSchema
  .prop('id', S.number())
  .prop('created_at', S.string().format('date'))
  .prop('modified_at', S.string().format('date'))

const documentResponse = S.object().prop('data', documentReadSchema)
const documentListResponse = S.object().prop('data', S.array().items(documentReadSchema))

const validCols = Object.keys(documentReadSchema.valueOf().properties)
// console.log(validCols.map(c => S.string(c)))
const numberQueryList = S.oneOf([S.string().pattern(/^\d+(,\d+)*$/), S.array().items(S.number())])

module.exports = function (fastify, opts, next) {
  fastify.route({
    url: '/document-relationships',
    method: 'GET',
    handler: async request => {
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
      body: documentUpsertSchema.required(['docschema', 'title']),
      response: {
        200: documentResponse
      }
    },
    handler: async (request, reply) => {
      const client = await fastify.pg.connect()
      const { rows: [created] } = await client.query(queries.create(request.body))
      client.release()
      reply.status(201)
      return { data: created }
    }
  })

  fastify.route({
    url: '/document/:id',
    method: 'GET',
    schema: {
      response: {
        200: documentResponse
      },
      query: S.object()
        .prop('cols', S.oneOf([S.string(), S.array().items(S.string())]))
    },
    handler: async request => {
      const client = await fastify.pg.connect()
      const { id } = request.params
      const { cols = validCols } = request.query
      const colsArray = Array.isArray(cols) ? cols : cols.split(',')

      const res = await client.query(queries.select(id, { cols: colsArray }))
      client.release()

      if (res.rowCount === 0) {
        throw fastify.httpErrors.notFound()
      }

      return { data: res.rows[0] }
    }
  })

  fastify.route({
    url: '/document/:id',
    method: 'PUT',
    schema: {
      params: S.object().prop('id', S.integer()),
      body: documentUpsertSchema,
      response: {
        200: documentResponse
      }
    },
    handler: async request => {
      const client = await fastify.pg.connect()
      const { id } = request.params
      const { rows: [existing] } = await client.query(queries.select(id))
      if (!existing) {
        throw fastify.httpErrors.notFound()
      }
      const updatequery = queries.update(id, request.body)
      const updated = await client.query(updatequery)

      await client.release()
      return { data: updated.rows[0] }
    }
  })

  fastify.route({
    url: '/document',
    method: 'GET',
    schema: {
      response: {
        200: documentListResponse
      },
      query: S.object()
        .prop('filter', numberQueryList)
        .prop('cols', S.oneOf([S.string(), S.array().items(S.string())]))
        .prop('find', S.string())
        .prop('pg', S.number())
        .prop('limit', S.number())
        .prop('match', S.enum(['any', 'all']))
        .prop('type', numberQueryList)
        .prop('only', numberQueryList)
        .prop('orderby', S.enum(validCols))
        .prop('dir', S.enum(['asc', 'desc']))
    },
    handler: async (request) => {
      const client = await fastify.pg.connect()
      // const docs = { rows: [] }
      const {
        filter = [],
        cols = validCols,
        find,
        pg,
        limit,
        match,
        type = [],
        only = [],
        orderby,
        dir
      } = request.query

      const colsArray = Array.isArray(cols) ? cols : cols.split(',')
      const filterArray = Array.isArray(filter) ? filter : filter.split(',')
      const onlyArray = Array.isArray(only) ? only : only.split(',')
      const typesArray = Array.isArray(type) ? type : type.split(',')

      const { rows } = await client.query(queries.list({
        filter: filterArray,
        cols: colsArray,
        find,
        pg,
        limit,
        match,
        type: typesArray,
        only: onlyArray,
        orderby,
        dir
      }))

      await client.release()

      return {
        data: rows
      }
    }
  })

  fastify.route({
    url: '/document/:id',
    method: 'DELETE',
    handler: async request => {
      const client = await fastify.pg.connect()
      const { id } = request.params
      const res = await client.query(queries.delete(id))
      if (res.rowCount === 0) {
        throw (fastify.httpErrors.notFound())
      }
      return ''
    }

  })

  next()
}
