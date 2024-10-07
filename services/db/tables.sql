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
    user_id INTEGER NOT NULL REFERENCES users(ID),
    place_name TEXT,
    address TEXT,
    location_link TEXT,
    image_url TEXT,
    description TEXT,
    visited BOOLEAN DEFAULT FALSE,
    is_draft BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT CHECK(STATUS IN ('DRAFT', 'ACTIVE')) NOT NULL,
    UNIQUE(USER_ID, ID)
);

-- Carousel Images table (if using a separate table)
CREATE TABLE IF NOT EXISTS carousal_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id INTEGER NOT NULL REFERENCES places(ID) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);