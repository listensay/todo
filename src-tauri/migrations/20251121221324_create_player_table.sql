-- Create player table for gamification features
CREATE TABLE player (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Only one player allowed
    nickname VARCHAR(50) NOT NULL DEFAULT '冒险家',
    avatar VARCHAR(100) DEFAULT 'default',
    level INTEGER NOT NULL DEFAULT 1,
    exp INTEGER NOT NULL DEFAULT 0,
    total_tasks_completed INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 0,
    last_login_date DATE,
    coins INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(50) DEFAULT '新手',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

