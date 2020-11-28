const SQL = require('sql-template-strings')

function create (payload) {
  const {
    docschema,
    title,
    excerpt,
    body,
    metadata,
    content,
    related
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
