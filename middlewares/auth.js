const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied! User Not Authorized');

    try {
        const user = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = user;
        next();
    }
    catch(error) {
        return res.status(400).send('Invalid token!');
    }
}

module.exports = auth;