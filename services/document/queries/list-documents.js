const SQL = require('sql-template-strings')

function getDocumentsByRelatedIds ({ filter = [] }) {
  return SQL`
  SELECT d.*
  FROM document d
  LEFT  JOIN "document_relationship" rel ON d.id=rel.document_base
  LEFT JOIN "document" d2 ON rel.document_rel = d2.id
  WHERE rel.document_rel = ANY (${filter}) `
}

function filterByRelationships ({ filter = [] }) {
  const query = SQL`SELECT DISTINCT d.* FROM "document" dr1`
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

function listDocuments ({ filter = [], find = '', pg = 0, limit = 30, match = 'all', type = null }) {
  let query = SQL``

  if (filter.length) {
    if (match === 'any') {
      query = getDocumentsByRelatedIds({ filter })
    } else {
      query = filterByRelationships({ filter })
    }
  } else {
    query = SQL`
    SELECT * FROM "document" d WHERE true
    `
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
    AND d.doctype = ${type}
    `)
  }

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
