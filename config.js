const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

let pool = null;

if (isProduction){
    pool = new Pool({
        connectionString : process.env.DATABASE_URL, ssl : {
            rejectUnauthorized : false
        }
    })
} else {
    pool = new Pool({
        user : "postgres",
        password : "postgres",
        host : "localhost",
        database : "budget-buddy",
        port : 5432
    })
}

module.exports = { pool }