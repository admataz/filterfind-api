const create = require('./insert-document')
const listDocuments = require('./list-documents')
const addTag = require('./tag-document')

module.exports = {
  create,
  list: listDocuments,
  addTag
}
