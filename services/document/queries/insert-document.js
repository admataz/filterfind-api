const SQL = require('sql-template-strings')

function create (payload) {
  const {
    doctype,
    title,
    excerpt,
    body,
    metadata,
    content
  } = payload

  return SQL`
        INSERT INTO document(
            doctype,
            title, 
            excerpt,
            body,
            metadata,
            content
        )
        VALUES (
            ${doctype}, 
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
