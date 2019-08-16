module.exports = {
    async myGames(req, res) {
        console.log('getting my games');
        if (!req.session.user)
            res.status(400).send('You must be logged in to see your games.');
        const db = req.app.get('db');
        const myGames = await db.games.getUsersGames(req.session.user.user_id);
        console.log(myGames);
        return res.send(myGames);

    },
    async createNewGame(req, res) {

    }
}