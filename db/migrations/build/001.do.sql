
CREATE TABLE docschema (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    jsonschema jsonb NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE document (
    id SERIAL PRIMARY KEY,
    docschema integer NULL REFERENCES "docschema"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    body TEXT,
    metadata jsonb NULL,
    content jsonb NULL,
    related jsonb NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE document_relationship (
    id SERIAL PRIMARY KEY,
    document_base integer NULL REFERENCES "document"(id) ON DELETE CASCADE,
    document_rel integer NULL REFERENCES "document"(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);  

CREATE OR REPLACE FUNCTION addRelationship() RETURNS TRIGGER AS $example_table$
   BEGIN
      UPDATE "document" SET related = array_to_json(array(SELECT document_rel FROM document_relationship WHERE document_base=NEW.document_base))  WHERE "document".id=NEW.document_base;
      RETURN NEW;
   END;
$example_table$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION removeRelationship() RETURNS TRIGGER AS $example_table$
   BEGIN
      UPDATE "document" SET related = array_to_json(array(SELECT document_rel FROM document_relationship WHERE document_base=OLD.document_base))  WHERE "document".id=OLD.document_base;
      RETURN OLD;
   END;
$example_table$ LANGUAGE plpgsql;

CREATE TRIGGER update_relationship
    AFTER INSERT ON document_relationship
    FOR EACH ROW EXECUTE PROCEDURE addRelationship();

CREATE TRIGGER remove_relationship
    AFTER DELETE ON document_relationship
    FOR EACH ROW EXECUTE PROCEDURE removeRelationship();
