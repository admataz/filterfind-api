const SQL = require('sql-template-strings')

function getDocumentsByTagIds ({ filter = [] }) {
  const q = SQL`
  SELECT d.title, t.label 
  FROM document d
  LEFT  JOIN "tag_document" td ON d.id=td.document_id
  LEFT JOIN "tag" t ON td.tag_id = t.id
  WHERE td.tag_id = ANY (${filter}) `

  return q
}

function filterByTags ({ filter = [] }) {
  const query = SQL`SELECT DISTINCT d.* FROM "tag" t1`
  let crossJoins = ''
  let innerJoins = ''

  let tagCount = 2

  while (tagCount <= filter.length) {
    crossJoins = `${crossJoins}
    CROSS JOIN "tag" t${tagCount}
    `

    innerJoins = `${innerJoins}
    JOIN "tag_document" t_d${tagCount}
    ON t_d${tagCount - 1}.document_id = t_d${tagCount}.document_id
    AND t_d${tagCount}.tag_id = t${tagCount}.id
    `
    tagCount += 1
  }

  query.append(`${crossJoins}
  JOIN "tag_document" t_d1
  ON t1.id = t_d1.tag_id
  JOIN "document" d
  ON t_d1.document_id = d.id
  ${innerJoins}`)

  const tagswhere = filter.reduce((prev, curr, i) => {
    return prev
      .append(`AND t${i + 1}.id`)
      .append(SQL`=${curr}`)
  }
  , SQL``)

  query.append(tagswhere)
  return query
}

function listDocuments ({ filter = [], find = '', pg = 0, limit = 30, match = 'all' }) {
  let query = SQL``

  if (filter.length) {
    if (match === 'any') {
      query = getDocumentsByTagIds({ filter })
    } else {
      query = filterByTags({ filter })
    }
  } else {
    query = SQL`
    SELECT * FROM document WHERE true
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
