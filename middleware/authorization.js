const jwt = require('jsonwebtoken');

const authenticateToken = async(req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Access denied: no authorization header');
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).send('Access denied: no token');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userid;
        next();
    } catch (error) { 
        res.status(403).send('Invalid token');
    }
} 

module.exports = { authenticateToken }