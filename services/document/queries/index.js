const create = require('./insert-document')
const listDocuments = require('./list-documents')
const addTag = require('./tag-document')
const relationships = require('./relationships')
const select = require('./select-document')
const update = require('./update-document')
const deleteDocument = require('./delete-document')

module.exports = {
  create,
  select,
  update,
  delete: deleteDocument,
  list: listDocuments,
  addTag,
  relationships
}
