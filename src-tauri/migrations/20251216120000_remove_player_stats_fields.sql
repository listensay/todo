-- Remove total_tasks_completed and streak_days fields from player table
-- These stats are now calculated from todos table directly

-- SQLite does not support DROP COLUMN directly, so we need to recreate the table
CREATE TABLE player_new (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    nickname VARCHAR(50) NOT NULL DEFAULT '冒险家',
    avatar VARCHAR(100) DEFAULT 'default',
    level INTEGER NOT NULL DEFAULT 1,
    exp INTEGER NOT NULL DEFAULT 0,
    last_login_date DATE,
    coins INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(50) DEFAULT '新手',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Copy data from old table (excluding removed columns)
INSERT INTO player_new (id, nickname, avatar, level, exp, last_login_date, coins, title, created_at, updated_at)
SELECT id, nickname, avatar, level, exp, last_login_date, coins, title, created_at, updated_at
FROM player;

-- Drop old table
DROP TABLE player;

-- Rename new table
ALTER TABLE player_new RENAME TO player;
