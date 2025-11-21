-- SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
-- Create new table without description
CREATE TABLE todos_new (
    id INTEGER PRIMARY KEY,
    name VARCHAR(30),
    status VARCHAR(30),
    difficulty VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Copy data from old table (excluding description)
INSERT INTO todos_new (id, name, status, difficulty, created_at, updated_at)
SELECT id, name, status, difficulty, created_at, updated_at FROM todos;

-- Drop old table
DROP TABLE todos;

-- Rename new table to original name
ALTER TABLE todos_new RENAME TO todos;
