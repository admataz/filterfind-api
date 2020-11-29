const SQL = require('@nearform/sql')

function addRelationship ({ baseDocumentId, relatedDocumentId }) {
  return SQL`
      UPDATE document SET related = array_append(related, ${relatedDocumentId})  WHERE id=${baseDocumentId};
    `
}

module.exports = addRelationship
