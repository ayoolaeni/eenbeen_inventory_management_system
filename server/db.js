const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",     
    user: "postgres",
    port: 5432,
    password: "200212",
    database: "inventory_ms"
});

module.exports = pool;
