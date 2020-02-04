const SQL = require('sql-template-strings')

function addRelationship ({ baseDocumentId, relatedDocumentId }) {
  return SQL`
      INSERT INTO document_relationship(document_base, document_rel) VALUES (${baseDocumentId}, ${relatedDocumentId})
    `
}

module.exports = addRelationship
