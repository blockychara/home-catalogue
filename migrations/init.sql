-- Init D1 schema for Home Catalogue

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  password_hash TEXT,
  hint TEXT,
  is_public INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  value TEXT,
  hidden INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS types (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  value TEXT,
  hidden INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  type_id TEXT,
  location_id TEXT,
  details TEXT,
  photos TEXT,
  hidden INTEGER DEFAULT 0,
  in_use INTEGER DEFAULT 0,
  temp_location TEXT,
  created_at INTEGER
);
