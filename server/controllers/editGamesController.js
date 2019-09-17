module.exports = {
    async myGames(req, res) {
        try {
            if (!req.session.user)
                return res.status(400).send('You must be logged in to see your games.');
            const db = req.app.get('db');
            const myGames = await db.editGames.getGamesByUserId(req.session.user.user_id);
            return res.send(myGames);
        } catch (err) {
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
            const existingGame = await db.editGames.getGameByName(gameName);
            if (existingGame[0])
                return res.status(400).send('A game by that name already exists. Please choose a different name.');
            const { user_id } = req.session.user;
            const creationTime = String(Math.floor(Date.now() / 1000));
            const newGame = await db.editGames.createNewGame(user_id, gameName, gameDescription, mapWidth, mapHeight, creationTime);
            return res.send(newGame[0]);

        } catch (err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    },
    async getGame(req, res) {
        try {
            const db = req.app.get('db');
            const games = await db.editGames.getGameById(req.params.gameId);
            return res.send(games[0]);
        } catch (err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    },
    async editGameDetails(req, res) {
        try {
            let { newName, newDescription, newMapWidth, newMapHeight, gameId } = req.body;
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
            const existingGame = await db.editGames.getGameByName(newName);
            if (existingGame[0] && existingGame[0].game_id !== gameId)
                return res.status(400).send('A game by that name already exists. Please chooes a different name.')
            const checkCreatorId = await db.editGames.getGameById(gameId);
            const updatedGame = await db.editGames.updateGameDetails(newName, newDescription, newMapWidth, newMapHeight, gameId);
            /*
                ADD CODE TO DELETE ROOMS AND PATHS OUTSIDE THE NEW MAX RANGES.
                PROBABLY NEED TO CHECK FOR OBJECTS WHOSE STARTING POSITION IS OUTSIDE AS WELL AND REMOVE THEIR POSITIONS.
            */
            return res.send(updatedGame[0]);
        } catch (err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    },
    async getMapData(req, res) {
        try {
            const { gameId } = req.params;
            const db = req.app.get('db');
            const rooms = await db.editGames.getRoomsByGameId(gameId);
            const paths = await db.editGames.getPathsByGameId(gameId);
            return res.send({rooms, paths});
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')            
        }
    },
    async createRoom(req, res) {
        try {
            const { roomX, roomY, gameId } = req.body;
            const db = req.app.get('db');
            const existingRoom = await db.editGames.getRoomByCoords(roomX, roomY, gameId);
            if (existingRoom[0])
                return res.status(400).send('A room already exists in that space.');
            const rooms = await db.editGames.createRoom(roomX, roomY, gameId);
            return res.send(rooms);
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')            
        }
    },
    async deleteRoom(req, res) {
        try {
            const { roomId, gameId } = req.body;
            const db = req.app.get('db');
            const rooms = await db.editGames.deleteRoomById(roomId, gameId);
            /*
                ADD CODE TO REMOVE THE STARTING LOCATION OF OBJECTS THAT START IN THIS ROOM
                ADD CODE TO DELETE CONNECTING PATHS OF DELETED ROOM
            */

            res.send(rooms);
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')            
        }
    },
    async createPath(req, res) {
        try {
            const { x1, y1, x2, y2, gameId } = req.body;
            const db = req.app.get('db');
            const existingPath = await db.editGames.getPathByCoordsAndId(x1, y1, x2, y2, gameId);
            if (existingPath[0])
                return res.status(400).send('A path already exists in this place');
            const roomCheck = await db.editGames.getRoomsForPathCheck(x1, y1, x2, y2, gameId);
            if (roomCheck.length !== 2)
                return this.status(400).send('A path can only be created between two active rooms.');
            const paths = await db.editGames.createPath(x1, y1, x2, y2, gameId);
            console.log(paths);
            return res.send(paths);
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')            
        }
    }
}