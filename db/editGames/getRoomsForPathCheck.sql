SELECT *
FROM rooms
WHERE ((room_x = $1 AND room_y = $2)
OR (room_x = $3 AND room_y = $4))
AND game_id = $5;