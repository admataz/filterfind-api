function documentRelationships () {
  return `SELECT 
    d.id, d.docschema s, d.title t, d.related r 
    FROM document d
    LIMIT 10000`
}

module.exports = documentRelationships
