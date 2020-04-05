const { Pool, Client } = require('pg')

const pool = new Pool({ connectionString: 'postgres://connormatheny@localhost:5432/games', ssl: false})

module.exports = {
    query: (text, params) => pool.query(text, params)
}