const SQL = require('sql-template-strings')

function selectCols (cols, prefix = '') {
  const c = cols.reduce((prev, curr, i) => {
    return i === 0
      ? prev.append(` ${prefix}.${curr} `)
      : prev.append(`, ${prefix}.${curr}`)
  }, SQL``)
  return c
}

function getDocumentsByRelatedIds ({ filter = [], cols }) {
  return filter.reduce((prev, curr, i) => {
    return i === 0
      ? prev.append(`${curr} = ANY (d.related)`)
      : prev.append(` OR ${curr} = ANY (d.related)`)
  }, SQL``)
}

function filterByRelationships ({ filter = [], cols }) {
  return filter.reduce((prev, curr, i) => {
    return i === 0
      ? prev.append(`${curr} = ANY (d.related)`)
      : prev.append(` AND ${curr} = ANY (d.related)`)
  }, SQL``)
}

function listDocuments ({
  filter = [],
  find = '',
  pg = 0,
  limit = 30,
  match = 'all',
  type = [],
  cols = [],
  only = [],
  orderby = 'created_at',
  dir = 'asc'
}) {
  let query = SQL``

  if (!cols.includes(orderby)) {
    cols.push(orderby)
  }

  query = SQL`SELECT
    `
  query.append(selectCols(cols, 'd'))

  query.append(`
    FROM "document" d
    WHERE true
    `)

  if (filter.length) {
    query.append('AND (')
    if (match === 'any') {
      query.append(getDocumentsByRelatedIds({ filter, cols }))
    } else {
      query.append(filterByRelationships({ filter, cols }))
    }
    query.append(`)
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
    query.append(`
    ORDER BY lower("${orderby}") ${dir}
    `)
  } else {
    query.append(`
    ORDER BY "${orderby}" ${dir}
    `)
  }

  if (limit) {
    query.append(SQL`
    LIMIT ${limit} OFFSET ${pg}
    `)
  }

  // console.log(query.text)
  // console.log(query.values)

  return query
}

module.exports = listDocuments
