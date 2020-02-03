const SQL = require('sql-template-strings')

function create (payload) {
  const {
    label,
    description
  } = payload

  return SQL`
        INSERT INTO tag(
            label,
            description
        )
        VALUES (
            ${label},
            ${description}
        )
        RETURNING id
    `
}

module.exports = {
  create
}
