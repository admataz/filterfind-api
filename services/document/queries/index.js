const create = require('./insert-document')
const listDocuments = require('./list-documents')
const addTag = require('./tag-document')
const relationships = require('./relationships')

module.exports = {
  create,
  list: listDocuments,
  addTag,
  relationships
}
