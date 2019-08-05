INSERT INTO users
    (username, password)
VALUES
    (${username}, ${pwHash})
RETURNING *;