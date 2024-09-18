const { Pool } = require('pg');
require('dotenv');

const connectionString = process.env.DATABASE_CONNECTION_URL;

const pool = new Pool({
  connectionString: "postgresql://postgres:GxdcOsvUxssAmbflUASBvnpiVaaoASbh@autorack.proxy.rlwy.net:58099/railway"
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
