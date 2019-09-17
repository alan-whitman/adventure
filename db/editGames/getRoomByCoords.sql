SELECT *
FROM rooms
WHERE room_x = $1 AND room_y = $2 and game_id = $3;