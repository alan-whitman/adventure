INSERT INTO paths
    (x1, y1, x2, y2, game_id)
VALUES
    ($1, $2, $3, $4, $5);
SELECT *
FROM paths
WHERE game_id = $5;