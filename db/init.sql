create table users (
    user_id             SERIAL PRIMARY KEY,
    username            VARCHAR(30) NOT NULL,
    password            VARCHAR(60) NOT NULL
);
create table games (
    game_id             SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL,
    game_name           VARCHAR(60) NOT NULL,
    game_description    TEXT
);
create table game_maps (
    map_id              SERIAL PRIMARY KEY,
    game_id             INTEGER NOT NULL,

);
create table map_rooms (
    room_id             SERIAL PRIMARY KEY,
    map_id              INTEGER NOT NULL
)