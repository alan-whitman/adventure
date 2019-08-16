module.exports = (requiredPrivilegeLevel) => {
    return (
        (req, res, next) => {
            if (!req.session.user)
                return res.status(403).send('No user logged in.');
            if (req.session.user.privilege_level > requiredPrivilegeLevel)
                return res.status(403).send('Insufficient privileges to carry out this command.');
            next();
        }
    )
}