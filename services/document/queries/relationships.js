function documentRelationships () {
  return `SELECT 
    d.id, d.doctype, d.title, 
    array_to_string(array(SELECT document_rel FROM document_relationship WHERE document_base=d.id),', ') r
    FROM document d
    LIMIT 1000`
}

module.exports = documentRelationships
