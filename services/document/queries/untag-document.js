const SQL = require('sql-template-strings')

function removeRelationship ({ baseDocumentId, relatedDocumentId }) {
  return SQL`
      UPDATE document SET related = array_remove(related, ${relatedDocumentId})  WHERE id=${baseDocumentId};
    `
}

module.exports = removeRelationship
