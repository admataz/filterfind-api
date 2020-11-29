const SQL = require('@nearform/sql')
function selectDocument (id, { cols } = {}) {
  const query = SQL`SELECT
  `
  const colsArray = cols || []
  const allCols = colsArray.map(col => SQL`${col}`)
  query.append(query.glue(allCols, ','), { unsafe: true })
  query.append(SQL`FROM "document" WHERE id = ${id}`)
  return query
}

module.exports = selectDocument
