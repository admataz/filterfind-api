const SQL = require('sql-template-strings')

function create (payload) {
  const {
    label,
    description
  } = payload

  return SQL`
        INSERT INTO vocabulary(
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
function tagVocabulary ({ tagId, vocabId }) {
  return SQL`
    INSERT INTO tag_vocabulary(tag_id, vocabulary_id) VALUES (${tagId}, ${vocabId})
  `
}

module.exports = {
  create,
  tagVocabulary
}
