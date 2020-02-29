
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
    related INT [] NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

