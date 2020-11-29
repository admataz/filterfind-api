const SQL = require('@nearform/sql')

function selectCols (cols, prefix = '') {
  const c = cols.reduce((prev, curr, i) => {
    return i === 0
      ? prev.append(SQL` ${prefix}.${curr} `, { unsafe: true })
      : prev.append(SQL`, ${prefix}.${curr}`, { unsafe: true })
  }, SQL``)
  return c
}

function getDocumentsByRelatedIds ({ filter = [], cols }) {
  return filter.reduce((prev, curr, i) => {
    return i === 0
      ? prev.append(SQL`${curr} = ANY (d.related)`)
      : prev.append(SQL` OR ${curr} = ANY (d.related)`)
  }, SQL``)
}

function filterByRelationships ({ filter = [], cols }) {
  return filter.reduce((prev, curr, i) => {
    return i === 0
      ? prev.append(SQL`${curr} = ANY (d.related)`)
      : prev.append(SQL` AND ${curr} = ANY (d.related)`)
  }, SQL``)
}

function listDocuments ({
  cols = [],
  dir = 'asc',
  filter = [],
  find = '',
  limit = 30,
  match = 'all',
  only = [],
  orderby = 'created_at',
  pg = 0,
  type = []
}) {
  let query = SQL``

  if (!cols.includes(orderby)) {
    cols.push(orderby)
  }

  query = SQL`SELECT
    `
  query.append(selectCols(cols, 'd'))

  query.append(SQL`
    FROM "document" d
    WHERE true
    `)

  if (filter.length) {
    query.append(SQL`AND (`)
    if (match === 'any') {
      query.append(getDocumentsByRelatedIds({ filter, cols }))
    } else {
      query.append(filterByRelationships({ filter, cols }))
    }
    query.append(SQL`)
      `)
  }

  if (only.length) {
    query.append(SQL`
    AND id = ANY(${only})
    `)
  }

  if (find) {
    const findlike = `%${find}%`
    query.append(SQL`
      AND (d.excerpt ILIKE ${findlike} 
      OR d.title ILIKE ${findlike}
      OR d.body ILIKE ${findlike})
      `)
  }

  if (type.length) {
    query.append(SQL`
    AND d.docschema = ANY(${type})
    `)
  }

  if (['title', 'excerpt', 'body'].includes(orderby)) {
    query.append(SQL`
    ORDER BY lower("${orderby}") ${dir}
    `, { unsafe: true })
  } else {
    query.append(SQL`
    ORDER BY "${orderby}" ${dir}
    `, { unsafe: true })
  }

  if (limit) {
    query.append(SQL`
    LIMIT ${limit} OFFSET ${pg}
    `)
  }

  return query
}

module.exports = listDocuments
