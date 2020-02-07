const SQL = require('sql-template-strings')

function deleteDocument (id) {
  const query = SQL`
  DELETE FROM "document" 
  WHERE id = ${id}
  RETURNING id
  `
  return query
}

module.exports = deleteDocument
