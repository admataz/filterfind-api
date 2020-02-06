const SQL = require('sql-template-strings')

function create (payload) {
  const {
    label,
    description,
    jsonschema = null
  } = payload

  return SQL`
        INSERT INTO docschema(
            label,
            description,
            jsonschema
        )
        VALUES (
            ${label},
            ${description},
            ${jsonschema}
        )
        RETURNING id
    `
}

module.exports = {
  create
}
