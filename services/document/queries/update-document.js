const SQL = require('sql-template-strings')

function update (id, payload) {
  const validCols = [
    'docschema',
    'title',
    'excerpt',
    'body',
    'metadata',
    'content',
    'related'
  ]
  const keyvals = Object.entries(payload).filter(kv => validCols.includes(kv[0]))
  const query = SQL`
  UPDATE "document" 
  `
  const updatevals = keyvals.reduce((prev, curr, i) => {
    const next = prev.append(` ${curr[0]}=`)
    next.append(SQL`${curr[1]}`)
    next.append((i < keyvals.length - 1
      ? `,
    `
      : `
    `))
    return next
  }, SQL`SET`)

  query.append(updatevals)

  query.append(SQL`
  WHERE id = ${id}
  RETURNING *
  `
  )

  return query
}

module.exports = update
