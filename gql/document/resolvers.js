require('dotenv-expand')(require('dotenv').config())
const docQueries = require('../../services/document/queries')
const schemaQueries = require('../../services/docschema/queries')

const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json')
// const {GraphQLDateTime} = require('graphql-iso-date')

const resolvers = {
  JSONObject: GraphQLJSONObject,
  JSON: GraphQLJSON,
  Query: {
    async docschema (parent, args, { app }, info) {
      const db = await app.pg.connect()
      const { rows } = await db.query(
        schemaQueries.list({
          filter: [],
          cols: ['*']
        })
      )
      db.release()
      return rows
    },
    async document (parent, args, { app }, info) {
      const db = await app.pg.connect()
      const { rows } = await db.query(docQueries.list(args))
      db.release()
      return rows
    },
    async documentRelations (parent, args, { app }, info) {
      const db = await app.pg.connect()
      const relationships = await db.query(docQueries.relationships())
      db.release()
      return relationships.rows
    }
  },
  Mutation: {
    async saveDocument (parent, args, { app }, info) {
      const db = await app.pg.connect()
      if (!args.document.docschema) {
        args.document.docschema = 1
      }

      const savedDocument = args.document.id
        ? await db.query(docQueries.update(args.document.id, args.document))
        : await db.query(docQueries.create(args.document))
      db.release()
      return savedDocument.rows
    }
  },

  Document: {
    async relatedDocs (parent, args, { app }, info) {
      const db = await app.pg.connect()

      const { rows } = await db.query(
        docQueries.list({
          filter: [],
          cols: ['*'],
          only: parent.related
        })
      )
      db.release()
      return rows
    }
  },

  DocSchema: {
    async documents (parent, args, { app }, info) {
      const db = await app.pg.connect()

      const { rows } = await db.query(
        docQueries.list({
          filter: [],
          cols: ['*'],
          type: parent.id
        })
      )
      db.release()
      return rows
    }
  },
  DocRels: {
    async schema (parent, args, { app }, info) {
      const db = await app.pg.connect()

      const { rows } = await db.query(
        schemaQueries.list({
          filter: [],
          cols: ['*']
        })
      )
      db.release()

      return rows[0]
    },

    async doc (parent, args, { app }, info) {
      const db = await app.pg.connect()

      const { rows } = await db.query(
        docQueries.list({
          only: parent.related
        })
      )
      db.release()

      return rows[0]
    }
  }
}

module.exports = resolvers
