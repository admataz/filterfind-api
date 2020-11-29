const SQL = require('@nearform/sql')

function create (payload) {
  const {
    docschema,
    title,
    excerpt,
    body,
    metadata,
    content
  } = payload

  return SQL`
        INSERT INTO document(
            docschema,
            title, 
            excerpt,
            body,
            metadata,
            content
        )
        VALUES (
            ${docschema},
            ${title}, 
            ${excerpt},
            ${body},
            ${metadata},
            ${content}
        )
        RETURNING *
    `
}

module.exports = create
