DELETE FROM rooms
WHERE room_id = $1;
SELECT *
FROM rooms
WHERE game_id = $2;