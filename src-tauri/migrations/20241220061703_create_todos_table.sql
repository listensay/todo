-- Add migration script here
CREATE TABLE todos (
    id INTEGER PRIMARY KEY,
    name VARCHAR(30),
    status VARCHAR(30),
    description TEXT,
    mark VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
