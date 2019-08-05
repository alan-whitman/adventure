create table users (
    user_id     SERIAL PRIMARY KEY,
    username    VARCHAR(30) NOT NULL,
    password    VARCHAR(60) NOT NULL
)