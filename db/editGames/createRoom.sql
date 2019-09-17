INSERT INTO rooms
    (room_x, room_y, game_id, room_name, room_description)
VALUES
    ($1, $2, $3, 'New Room', 'Room Description');
SELECT *
FROM rooms
WHERE game_id = $3;