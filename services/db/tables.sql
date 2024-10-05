-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

-- Places table
CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    place_name TEXT,
    address TEXT,
    location_link TEXT,
    image_url TEXT,
    description TEXT,
    visited BOOLEAN DEFAULT FALSE,
    is_draft BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT CHECK(status IN ('DRAFT', 'ACTIVE')) NOT NULL
);

-- Carousel Images table (if using a separate table)
CREATE TABLE IF NOT EXISTS carousel_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id INTEGER NOT NULL REFERENCES places(id),
    image_url TEXT
);
