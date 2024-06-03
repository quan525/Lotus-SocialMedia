const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "minjeong12",
    host: "localhost",
    port: 5432,
    database: "Social Media Website"
})

module.exports = pool