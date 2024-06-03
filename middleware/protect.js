const jwt = require('jsonwebtoken');
const pool = require('../config/postgresdb');
const authenticateToken = async(req, res, next) => {
    console.log(req.headers)
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('Access denied');
 
    const parts = authHeader.split(' ');
    if (parts.length !== 2) return res.status(401).send('Access denied');

    const token = parts[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userid;
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [req.userId]);
        if (user.rows.length === 0) return res.status(403).send('User not found');
        next();
    } catch (error) { 
        res.status(403).send(error.message);
    }
}

module.exports = { authenticateToken }