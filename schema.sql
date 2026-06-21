-- USERS

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    catalog_name TEXT NOT NULL,

    description TEXT DEFAULT '',

    is_public INTEGER DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SESSIONS

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,

    user_id INTEGER NOT NULL,

    expires_at DATETIME NOT NULL
);

-- ITEMS

CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    name TEXT NOT NULL,

    type TEXT NOT NULL,

    location TEXT NOT NULL,

    details TEXT DEFAULT '',

    image_key TEXT DEFAULT NULL,

    hidden INTEGER DEFAULT 0,

    in_use INTEGER DEFAULT 0,

    temporary_location TEXT DEFAULT '',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TYPES

CREATE TABLE item_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    value TEXT NOT NULL,

    hidden INTEGER DEFAULT 0
);

-- LOCATIONS

CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    value TEXT NOT NULL,

    hidden INTEGER DEFAULT 0
);

-- SETTINGS

CREATE TABLE settings (
    user_id INTEGER PRIMARY KEY,

    theme TEXT DEFAULT 'warm',

    grid_size TEXT DEFAULT 'medium',

    show_photos INTEGER DEFAULT 1,

    show_details INTEGER DEFAULT 1,

    photo_first INTEGER DEFAULT 0,

    sort_mode TEXT DEFAULT 'alphabetical'
);

CREATE TABLE themes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    background TEXT NOT NULL,

    card_background TEXT NOT NULL,

    accent TEXT NOT NULL,

    text_color TEXT NOT NULL
);

INSERT INTO themes (
    name,
    background,
    card_background,
    accent,
    text_color
)
VALUES

('Warm','#f8f6f1','#ffffff','#c58b39','#222'),
('Slate','#eef1f5','#ffffff','#556677','#222'),
('Forest','#eef5ee','#ffffff','#2f6b3f','#222'),
('Rose','#fff4f5','#ffffff','#c45878','#222'),
('Dark','#1a1a1a','#242424','#e0a84a','#ffffff'),
('Sand','#f4efe6','#ffffff','#b48a58','#222');
