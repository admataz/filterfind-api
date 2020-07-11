
const SQL = require('sql-template-strings')

function selectDocument (id, { cols } = {}) {
  // TODO: options to select specific fields
  const query = SQL``
  const colsArray = cols || []
  const c = colsArray.reduce((prev, curr, i) => {
    return prev.append(`,${curr} `)
  }, SQL`SELECT id `)
  query.append(c)
  query.append(SQL`FROM "document" WHERE id = ${id}`)
  return query
}

module.exports = selectDocument
