require('dotenv-expand')(require('dotenv').config())
const docQueries = require('../../services/document/queries')
const schemaQueries = require('../../services/docschema/queries')

const resolvers = {
  Query: {
    async docschema (parent, args, { db }, info) {
      const { rows } = await db.query(schemaQueries.list({
        filter: [],
        cols: ['*']
      }))
      return rows
    },
    async document (parent, args, { db }, info) {
      const { rows } = await db.query(docQueries.list(args))
      return rows
    },
    async documentRelations (parent, args, { db }, info) {
      const relationships = await db.query(docQueries.relationships())
      return relationships.rows
    }
  },

  Document: {
    async relatedDocs (parent, args, { db }, info) {
      const { rows } = await db.query(docQueries.list({
        filter: [],
        cols: ['*'],
        only: parent.related
      }))
      return rows
    }
  },

  DocSchema: {
    async documents (parent, args, { db }, info) {
      const { rows } = await db.query(docQueries.list({
        filter: [],
        cols: ['*'],
        type: parent.id
      }))
      return rows
    }

  },
  DocRels: {
    async schema (parent, args, { db }, info) {
      const { rows } = await db.query(schemaQueries.list({
        filter: [],
        cols: ['*']
      }))
      return rows[0]
    },
    async doc (parent, args, { db }, info) {
      const { rows } = await db.query(docQueries.list({
        filter: [],
        cols: ['*'],
        only: parent.related
      }))
      return rows[0]
    }
  }

}

module.exports = resolvers
