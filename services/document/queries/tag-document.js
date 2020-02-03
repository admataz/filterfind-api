const SQL = require('sql-template-strings')

function addTag ({ tagId, documentId }) {
  return SQL`
      INSERT INTO tag_document(tag_id, document_id) VALUES (${tagId}, ${documentId})
    `
}

module.exports = addTag
