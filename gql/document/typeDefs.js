const { gql } = require('apollo-server-fastify')

const typeDefs = gql`
  scalar JSON
  scalar JSONObject

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
    jsonschema: JSONObject
    documents:[Document]
  }

  type Document {
    docschema: Int
    title: String
    excerpt: String
    body: String
    metadata: JSONObject
    content: JSONObject
    related: [Int]
    relatedDocs: [Document]
    id: Int
    created_at: String
    modified_at: String
  }
  
  input DocumentInput {
    docschema: Int
    title: String
    excerpt: String
    body: String
    metadata: JSONObject
    content: JSONObject
    related: [Int]
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
      type:[Int] = [],
      cols:[String] = ["*"],
      only:[Int] = [],
      orderby:String = "created_at",
      dir: String = "asc"
    ): [Document]
    docschema: [DocSchema]
  }

  type Mutation {
    saveDocument(document: DocumentInput): [Document]
  }
`

module.exports = typeDefs
