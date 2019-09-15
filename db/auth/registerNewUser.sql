INSERT INTO users
    (username, password, creation_time)
VALUES
    (${username}, ${pwHash}, ${creationTime})
RETURNING *;