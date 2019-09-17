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
                return res.status(400).send('A game by that name already exists. Please choose a different name.');
            const { user_id } = req.session.user;
            const creationTime = String(Math.floor(Date.now() / 1000));
            const newGame = await db.games.createNewGame(user_id, gameName, gameDescription, mapWidth, mapHeight, creationTime);
            return res.send(newGame[0]);

        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    },
    async getGame(req, res) {
        try {
            if (!req.session.user)
                return res.status(400).send('You must be logged in to edit your games.'); 
            if (Number.isNaN(Number(req.params.gameId)))
                return res.status(400).send('Game IDs should be numbers. You seem to have reached this page in error.');
            const db = req.app.get('db');
            const games = await db.games.getGameById(req.params.gameId);
            if (!games[0])
                return res.status(400).send('No game found matching that ID.');
            const game = games[0];
            if (game.user_id !== req.session.user.user_id)
                return res.status(400).send('You can only edit your own games.');
            return res.send(game);
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    },
    async editGameDetails(req, res) {
        try {
            let { newName, newDescription, newMapWidth, newMapHeight, gameId } = req.body;
            if (!req.session.user)
                return res.status(400).send('You must be logged in to create a new game.');
            if (newName.length < 4 || newName.length > 40)
                return res.status(400).send('Your game name must be between 4 and 40 characters in length.');
            if (newDescription.length > 400)
                return res.status(400).send('Your game description cannot be more than 400 characters in length.');
            newMapWidth = Number(newMapWidth);
            newMapHeight = Number(newMapHeight);
            if (isNaN(newMapWidth) || isNaN(newMapHeight))
                return res.stat.send('Map width and height must be numbers betwen 1 and 15.');
            if (newMapWidth < 1 || newMapWidth > 15 || newMapHeight < 1 || newMapHeight > 15)
                return res.stat.send('Map width and height must be numbers betwen 1 and 15.');
            const db = req.app.get('db');
            const existingGame = await db.games.getGameByName(newName);
            if (existingGame[0] && existingGame[0].game_id !== gameId)
                return res.status(400).send('A game by that name already exists. Please chooes a different name.')
            const checkCreatorId = await db.games.getGameById(gameId);
            if (checkCreatorId[0].user_id !== req.session.user.user_id)
                return res.status(400).send('You can only edit your own games');
            const updatedGame = await db.games.updateGameDetails(newName, newDescription, newMapWidth, newMapHeight, gameId);
            /*
                ADD CODE TO DELETE ROOMS OUTSIDE THE MAX RANGE. 
                PROBABLY NEED TO CHECK FOR OBJCTS WHOSE STARTING POSITION IS OUTSIDE AS WELL
            */
            return res.send(updatedGame[0]);
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    }
}