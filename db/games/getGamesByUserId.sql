SELECT *
FROM games
WHERE user_id = $1
ORDER BY creation_time DESC;