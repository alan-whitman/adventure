UPDATE games
SET game_name = $1, game_description = $2, map_width = $3, map_height = $4
WHERE game_id = $5
RETURNING *;