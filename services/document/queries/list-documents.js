const SQL = require('sql-template-strings')

function selectCols (cols) {
  const c = cols.reduce((prev, curr, i) => {
    return i === 0 ? prev.append(` ${curr} `) : prev.append(`, ${curr}`)
  }, SQL``)
  return c
}

function getDocumentsByRelatedIds ({ filter = [], cols }) {
  const query = SQL`SELECT `
  query.append(selectCols(cols))

  query.append(SQL`
  FROM document d
  JOIN "document_relationship" rel ON d.id=rel.document_base
  JOIN "document" d2 ON rel.document_rel = d2.id
  WHERE rel.document_rel = ANY (${filter}) `)

  return query
}

function filterByRelationships ({ filter = [], cols }) {
  const query = SQL`SELECT DISTINCT `
  query.append(selectCols(cols))
  query.append('FROM "document" dr1')
  let crossJoins = ''
  let innerJoins = ''

  let tagCount = 2

  while (tagCount <= filter.length) {
    crossJoins = `${crossJoins}
    CROSS JOIN "document" dr${tagCount}
    `

    innerJoins = `${innerJoins}
    JOIN "document_relationship" rel${tagCount}
    ON rel${tagCount - 1}.document_base = rel${tagCount}.document_base
    AND rel${tagCount}.document_rel = dr${tagCount}.id
    `
    tagCount += 1
  }

  query.append(`${crossJoins}
  JOIN "document_relationship" rel1
  ON dr1.id = rel1.document_rel
  JOIN "document" d
  ON rel1.document_base = d.id
  ${innerJoins}`)

  const tagswhere = filter.reduce((prev, curr, i) => {
    return prev
      .append(`AND dr${i + 1}.id`)
      .append(SQL`=${curr}`)
  }
  , SQL``)

  query.append(tagswhere)
  return query
}

function listDocuments ({
  filter = [],
  find = '',
  pg = 0,
  limit = 30,
  match = 'all',
  type = null,
  cols = [],
  only = [],
  orderby = 'created_at',
  dir = 'asc'
}) {
  let query = SQL``

  if (filter.length) {
    if (match === 'any') {
      query = getDocumentsByRelatedIds({ filter, cols })
    } else {
      query = filterByRelationships({ filter, cols })
    }
  } else {
    query = SQL`SELECT
    `
    query.append(selectCols(cols))

    query.append(`
    FROM "document" d
    WHERE true
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
      AND (excerpt LIKE ${findlike} 
      OR title LIKE ${findlike}
      OR body LIKE ${findlike})
      `)
  }

  if (type) {
    query.append(SQL`
    AND d.docschema = ${type}
    `)
  }
  query.append(`
  ORDER BY "${orderby}" ${dir}
  `)

  query.append(SQL`
  LIMIT ${limit} OFFSET ${pg}
  `)

  return query
}

module.exports = listDocuments

// -- WHERE true
// -- AND (excerpt LIKE '%system%' OR title LIKE '%system%' OR body LIKE '%system%')
// -- AND metadata @> '{"bar": "Rustic payment magenta"}'
// -- AND LOWER(metadata ->> 'bar') LIKE LOWER('%rustic%')
// -- AND content -> 'data' -> 'prop1' <= '7403'
