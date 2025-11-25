-- Create config table for application settings (key-value pairs)
CREATE TABLE config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key VARCHAR(50) NOT NULL UNIQUE,
    value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default config: player_initialized
INSERT INTO config (key, value)
VALUES ('player_initialized', '0');
