const SQL = require('@nearform/sql')

function create (payload) {
  const {
    docschema = 1,
    title,
    excerpt = '',
    body = '',
    metadata = null,
    content = null,
    related = null
  } = payload

  return SQL`
        INSERT INTO document(
            docschema,
            title, 
            excerpt,
            body,
            metadata,
            content,
            related
        )
        VALUES (
            ${docschema},
            ${title}, 
            ${excerpt},
            ${body},
            ${metadata},
            ${content},
            ${related}
        )
        RETURNING *
    `
}

module.exports = create
