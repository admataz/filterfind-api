function documentRelationships () {
  return `SELECT 
    d.id, d.docschema s, d.title t, d.related r 
    FROM document d`
}

module.exports = documentRelationships
