CREATE TABLE users (
    user_id             SERIAL PRIMARY KEY,
    username            VARCHAR(30) NOT NULL,
    password            VARCHAR(60) NOT NULL,
    creation_time       TEXT NOT NULL
);
CREATE TABLE games (
    game_id             SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL,
    game_name           VARCHAR(60) NOT NULL,
    game_description    TEXT,
    map_width           INTEGER NOT NULL,
    map_height          INTEGER NOT NULL,
    creation_time       TEXT NOT NULL
);
CREATE TABLE rooms (
    room_id             SERIAL PRIMARY KEY,
    game_id             INTEGER NOT NULL,
    room_name           VARCHAR(60) NOT NULL,
    room_description    TEXT,
    room_x              INTEGER NOT NULL,
    room_y              INTEGER NOT NULL
);
CREATE TABLE paths (
    path_id             SERIAL PRIMARY KEY,
    game_id             INTEGER NOT NULL,
    path                VARCHAR(10) NOT NULL
);
CREATE TABLE game_objects (
    object_id           SERIAL PRIMARY KEY,
    game_id             INTEGER NOT NULL,
    object_name         VARCHAR(60) NOT NULL,
    starting_room       INTEGER,
    movable             BOOLEAN NOT NULL DEFAULT TRUE
);