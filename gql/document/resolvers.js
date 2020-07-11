require('dotenv-expand')(require('dotenv').config())
const docQueries = require('../../services/document/queries')
const schemaQueries = require('../../services/docschema/queries')

const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json')

const resolvers = {
  JSONObject: GraphQLJSONObject,
  JSON: GraphQLJSON,
  Query: {
    async docschema (parent, args, { db }, info) {
      const { rows } = await db.query(
        schemaQueries.list({
          filter: [],
          cols: ['*']
        })
      )
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
  Mutation: {
    async saveDocument (parent, args, { db }, info) {
      const savedDocument = args.document.id
        ? await db.query(docQueries.update(args.document.id, args.document))
        : await db.query(docQueries.create(args.document))
      return savedDocument.rows
    }
  },

  Document: {
    async relatedDocs (parent, args, { db }, info) {
      const { rows } = await db.query(
        docQueries.list({
          filter: [],
          cols: ['*'],
          only: parent.related
        })
      )
      return rows
    }
  },

  DocSchema: {
    async documents (parent, args, { db }, info) {
      const { rows } = await db.query(
        docQueries.list({
          filter: [],
          cols: ['*'],
          type: parent.id
        })
      )
      return rows
    }
  },
  DocRels: {
    async schema (parent, args, { db }, info) {
      const { rows } = await db.query(
        schemaQueries.list({
          filter: [],
          cols: ['*']
        })
      )
      return rows[0]
    },
    async doc (parent, args, { db }, info) {
      const { rows } = await db.query(
        docQueries.list({
          only: parent.related
        })
      )
      return rows[0]
    }
  }
}

module.exports = resolvers
