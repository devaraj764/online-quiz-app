require('dotenv').config()
const jwt = require('jsonwebtoken');

const verifyUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) res.status(501).send('Unauthorized request');
        const { userId, role } = jwt.verify(token, process.env.JWT_SECRET)
        if (!userId) res.status(501).send('Unauthorized request');
        req.userId = userId;
        req.role = role;
        next();
    } catch (err) {
        console.error("verification error", err)
    }
}

const verifyAdmin = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) res.status(501).send('Unauthorized request');
        const { userId, role } = jwt.verify(token, process.env.JWT_SECRET)
        if (!userId && role === 'admin') res.status(501).send('Unauthorized request');
        req.userId = userId;
        req.role = role;
        next();
    } catch (err) {
        console.error("verification error", err)
    }
}

module.exports = { verifyUser, verifyAdmin }