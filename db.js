const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // PostgreSQL username
    password: '1234567890', // Enter PostgreSQL password
    host: 'localhost',
    database: 'company_db',
});

module.exports = { pool };
