const SQL = require('@nearform/sql')

function update (id, payload) {
  const validCols = [
    'docschema',
    'title',
    'excerpt',
    'body',
    'metadata',
    'content',
    'related',
    'modified_at'
  ]
  const keyvals = Object.entries({ ...payload, modified_at: 'NOW()' }).filter(kv => validCols.includes(kv[0]))
  const query = SQL`
  UPDATE "document" 
  SET
  `
  const updates = keyvals.map(kv => {
    const setVal = SQL``
    setVal.append(SQL`${kv[0]}=`, { unsafe: true })
    setVal.append(SQL`${kv[1]}`)
    return setVal
  })
  query.append(query.glue(updates, ' , '))
  query.append(SQL`
  WHERE id = ${id}
  RETURNING *
  `
  )

  return query
}

module.exports = update
