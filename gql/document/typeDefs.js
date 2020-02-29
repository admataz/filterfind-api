const { gql } = require('apollo-server-fastify')

const typeDefs = gql`
  type DocRels {
    id: Int
    s: Int
    t: String
    r: [Int]
    schema: DocSchema
    doc: Document
    related: [Document]
  }

  type DocSchema {
    id: Int
    label: String
    description: String
    # jsonschema:
    documents:[Document]
  }

  type Document {
    docschema: DocSchema
    title: String
    excerpt: String
    body: String
    # metadata
    # content
    related: [Int]
    relatedDocs: [Document]
    id: Int
    created_at: String
    modified_at: String
  }


  type Query {
    documentRelations: [DocRels]
    document(
      filter:[Int] = [],
      find:String = "",
      pg:Int = 0,
      limit:Int = 30,
      match: String = "all",
      type:Int,
      cols:[String] = ["*"],
      only:[Int] = [],
      orderby:String = "created_at",
      dir: String = "asc"
    ): [Document]
    docschema: [DocSchema]
  }
`

module.exports = typeDefs
