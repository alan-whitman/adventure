INSERT INTO games
    (user_id, game_name, game_description, map_width, map_height, creation_time)
VALUES
    ($1, $2, $3, $4, $5, $6)
RETURNING *;