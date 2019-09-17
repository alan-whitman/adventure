module.exports = checkGameOwnerShip = async (req, res, next) => {
    if (!req.session.user)
        return res.status(400).send('You must be logged in to perform game editing operations.');
    let gameId = req.body.gameId ? req.body.gameId : req.params.gameId;
    if (!gameId)
        return res.status(400).send('Game ID not found.')
    const db = req.app.get('db');
    const game = await db.editGames.getGameById(gameId);
    if (!game[0])
        return res.status(400).send('Game not found.');
    if (game[0].user_id !== req.session.user.user_id)
        return res.status(400).send('You can only perform editing operations on your own games.')
    next();
};