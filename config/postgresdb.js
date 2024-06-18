const dotenv = require('dotenv')
dotenv.config()
const Pool = require("pg").Pool;

const pool = new Pool({
    connectionString: process.env.DBConfigLink,
    ssl: {
        rejectUnauthorized: false
    }
});


// const pool = new Pool({
//     user: "postgres",
//     password: "minjeong12",
//     host: "  ",
//     port: 5432,
//     database: "Social Media Website"
// })

module.exports = pool