module.exports = {
    async myGames(req, res) {
        try {
            if (!req.session.user)
                return res.status(400).send('You must be logged in to see your games.');
            const db = req.app.get('db');
            const myGames = await db.games.getGamesByUserId(req.session.user.user_id);
            return res.send(myGames);
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    },
    async createNewGame(req, res) {
        try {
            let { gameName, gameDescription, mapWidth, mapHeight } = req.body;
            if (!req.session.user)
                return res.status(400).send('You must be logged in to create a new game.');
            if (gameName.length < 4 || gameName.length > 40)
                return res.status(400).send('Your game name must be between 4 and 40 characters in length.');
            if (gameDescription.length > 400)
                return res.status(400).send('Your game description cannot be more than 400 characters in length.');
            mapWidth = Number(mapWidth);
            mapHeight = Number(mapHeight);
            if (isNaN(mapWidth) || isNaN(mapHeight))
                return res.stat.send('Map width and height must be numbers betwen 1 and 15.');
            if (mapWidth < 1 || mapWidth > 15 || mapHeight < 1 || mapHeight > 15)
                return res.stat.send('Map width and height must be numbers betwen 1 and 15.');
            const db = req.app.get('db');
            const existingGame = await db.games.getGameByName(gameName);
            if (existingGame[0])
                return res.status(400).send('A game by that name already exists. Please choose a different name');
            const { user_id } = req.session.user;
            const newGame = await db.games.createNewGame(user_id, gameName, gameDescription, mapWidth, mapHeight);
            console.log(newGame);
            return res.send(newGame[0]);

        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    }
}