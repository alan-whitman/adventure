const bcrypt = require('bcryptjs');
const stringIsValid = require('../utils/stringIsValid');

module.exports = {
    async register(req, res) {
        try {
            const { username, password } = req.body;
            if (!stringIsValid(username, /[^a-zA-Z0-9]/, 6, 24))
                return res.status(400).send('Invalid username.');
            if (!stringIsValid(password, /[^a-zA-Z0-9_@#$%^&*!?.]/, 8, 54))
                return res.status(400).send('Invalid password.');
            
            const db = req.app.get('db');
            const existingUser = await db.auth.getUserByUsername(username);
            if (existingUser[0])
                return res.status(400).send('Username in use.');

            const creationTime = String(Math.floor(Date.now() / 1000));
            const pwHash = bcrypt.hashSync(password, 10);
            const dbResult = await db.auth.registerNewUser({username, pwHash, creationTime});
            let user = dbResult[0]
            delete user.password;
            req.session.user = user;
            res.send(req.session.user);
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    },
    async login(req, res) {
        try {
            const db = req.app.get('db');
            const { username, password } = req.body;
            let user = await db.auth.getUserByUsername(username);
            if (!user[0])
                return res.status(400).send('User not found.');
            user = user[0];
            if (!bcrypt.compareSync(password, user.password))
                return res.status(400).send('Incorrect Password.');
            delete user.password;
            req.session.user = user;
            res.status(200).send(req.session.user);
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }

    },
    async logout(req, res) {
        try {
            req.session.destroy();
            res.sendStatus(200);
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    },
    async getCurrentUser(req, res) {
        try {
            if (req.session.user)
                res.send(req.session.user);
            else
                res.send({});
        } catch(err) {
            console.log(err);
            res.status(500).send('The server has encountered an error. Please try again later.')
        }
    
    }
}