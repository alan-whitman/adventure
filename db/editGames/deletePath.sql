DELETE FROM paths
WHERE path_id = $1 AND game_id = $2;
SELECT *
FROM paths
WHERE game_id = $2;