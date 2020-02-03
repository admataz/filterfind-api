const SQL = require('sql-template-strings')

function create (payload) {
  const {
    title,
    excerpt,
    body,
    metadata,
    content
  } = payload

  return SQL`
        INSERT INTO document(
            title, 
            excerpt,
            body,
            metadata,
            content
        )
        VALUES (
            ${title}, 
            ${excerpt},
            ${body},
            ${metadata},
            ${content}
        )
        RETURNING id
    `
}

module.exports = create
